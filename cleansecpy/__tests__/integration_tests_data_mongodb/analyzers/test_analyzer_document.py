from bson import ObjectId
import pytest
from cleansecpy.data.mongodb.analyzers.analyzer_document import AnalyzerDocument


@pytest.mark.parametrize(
    "_id,name,version",
    [
        (None, "Test", "1.0"),
        (ObjectId(), "Test", "2.0.5")
    ]
)
def test_new_returns_document(_id, name, version):
    # Act
    document = AnalyzerDocument(
        _id=_id,
        name=name,
        version=version
    )

    # Assert
    assert document.get('_id', default="") == str(_id or "")
    assert document.get('name', default=None) == name
    assert document.get('version', default=None) == version


@pytest.mark.parametrize(
    "_id,name,version",
    [(None, "", "1.0"),
     (None, "Test", ""),
     ("", "Test", "1.0")]
)
def test_new_raises_exception(_id, name, version):
    with pytest.raises(ValueError):
        AnalyzerDocument(_id, name, version)
