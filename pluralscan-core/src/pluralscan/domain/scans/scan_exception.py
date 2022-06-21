class ScanNotFoundError(Exception):
    """This error is raised when query a scan that doesn't exsits."""

    message = "The specified scan does not exists."

    def __str__(self) -> str:
        return ScanNotFoundError.message
