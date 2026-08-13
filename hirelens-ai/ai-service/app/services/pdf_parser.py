"""PDF -> raw text, with validation (Phase 1 of the resume parser pipeline)."""

from io import BytesIO
import pdfplumber

from app.utils.exceptions import InvalidPDFError, EmptyPDFError
from app.utils.text_processing import clean_text

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB


def extract_text_from_pdf(file_bytes: bytes) -> str:
    if not file_bytes:
        raise EmptyPDFError("The uploaded file is empty.")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise InvalidPDFError("File exceeds the 10MB size limit.")

    # PDF files start with the %PDF- magic bytes — quick sanity check before
    # handing it to pdfplumber, so we can give a clear error instead of a stack trace.
    if not file_bytes.lstrip().startswith(b"%PDF"):
        raise InvalidPDFError("The uploaded file is not a valid PDF.")

    try:
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            chunks = [page.extract_text() or "" for page in pdf.pages]
    except Exception as exc:
        raise InvalidPDFError(f"Could not read the PDF: {exc}") from exc

    raw_text = clean_text("\n".join(chunks))
    if not raw_text:
        raise EmptyPDFError("No extractable text found in this PDF (it may be a scanned image).")

    return raw_text
