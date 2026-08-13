class InvalidPDFError(Exception):
    """Raised when the uploaded file isn't a readable PDF."""


class EmptyPDFError(Exception):
    """Raised when a PDF has no extractable text."""
