import unittest

from __tests__.test_helpers import TestHelpers
from pluralscan.data.inmemory.projects.project_repository import \
    InMemoryProjectRepository
from pluralscan.domain.projects.project import Project


class TestInMemoryanalyzerRepository(unittest.TestCase):
    def setUp(self):
        self.repository = InMemoryProjectRepository()

    def test_add_returns_project(self):
        # Arrange
        project = Project()

        # Act
        result = self.repository.add(project)

        # Assert
        self.assertIsNotNone(result)
        self.assertIsNotNone(result.project_id)
        self.assertTrue(TestHelpers.is_valid_uuid(result.project_id))

    def test_find_all_returns_projects(self):
        # Arrange
        project = Project()
        self.repository.add(project)
        self.repository.add(project)

        # Act
        analyzers = self.repository.find_all()

        # Assert
        self.assertIsNotNone(analyzers)
        self.assertEqual(len(analyzers), 2)

    def test_get_by_id_returns_project(self):
        # Arrange
        project = Project()
        self.repository.add(project)
        project_id = project.project_id

        # Act
        result = self.repository.get_by_id(project_id)

        # Assert
        self.assertIsNotNone(result)

    def test_update_returns_project(self):
        # Arrange
        project = Project()
        self.repository.add(project)

        # Act
        project.name = "Custom Name"
        result = self.repository.update(project)

        # Assert
        self.assertIsNotNone(result)

    def test_given_valid_input_remove_returns(self):
        # Arrange
        project = Project()
        self.repository.add(project)
        project_id = project.id

        # Act
        def callable():
            self.repository.remove(project_id)

        # Assert
        self.assertTrue(callable)

    def test_given_invalid_input_remove_raises(self):
        # Arrange
        project_id = ""

        # Act
        def callable():
            self.repository.remove(project_id)

        # Assert
        self.assertRaises(Exception, callable)
