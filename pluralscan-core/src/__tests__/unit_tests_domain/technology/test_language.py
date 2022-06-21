import pytest

from pluralscan.domain.technology.language import Language


def test_given_invalid_value_raises_exception():
    with pytest.raises(Exception):
        Language("test")

def test_given_valid_value_returns_language():
    value = "Cobol"
    lang = Language(value)
    assert lang == Language.COBOL

def test_from_alias_raises_exception():
    alias = "cc#"
    with pytest.raises(ValueError):
        lang = Language.from_alias(alias)

def test_from_alias_returns_language():
    alias = "C#"
    lang = Language.from_alias(alias)
    assert lang == Language.CSHARP