import random
import string
import uuid


class TestHelpers:
    """TestHelpers"""
    @staticmethod
    def is_valid_uuid(value: str) -> bool:
        """is_valid_uuid"""
        try:
            uuid.UUID(str(value))
            return True
        except ValueError:
            return False

    @staticmethod
    def random_letters(length: int = 10) -> str:
        """random_letters"""
        letters = string.ascii_letters
        return ''.join(random.choice(letters) for _ in range(length))

    @staticmethod
    def random_digits(length: int = 10) -> str:
        """random_digits"""
        digits = string.digits
        return ''.join(random.choice(digits) for _ in range(length))
