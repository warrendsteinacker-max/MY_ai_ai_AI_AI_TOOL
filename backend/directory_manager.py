import os

class DirectoryManager:
    def __init__(self, base_root="book_data"):
        self.base_root = base_root

    def get_target_path(self, task_type, sub_folder):
        # Creates: book_data/College_Book/Chapter_1
        path = os.path.join(self.base_root, task_type, sub_folder)
        os.makedirs(path, exist_ok=True)
        return path

dm = DirectoryManager()