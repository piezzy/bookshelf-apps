document.addEventListener('DOMContentLoaded', function () {
  const bookSubmit = document.getElementById('bookSubmit');
  const inputBookForm = document.getElementById('inputBook');

  const incompleteBookshelfList = document.getElementById(
    'incompleteBookshelfList'
  );
  const completeBookshelfList = document.getElementById(
    'completeBookshelfList'
  );

  const modal = document.getElementById('bookAddedModal');
  const closeButton = document.querySelector('.close-button');

  const STORAGE_KEY = 'BOOKSHELF_APPS';
  let books = [];

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function findBook(bookId) {
    for (book of books) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    let index = 0;
    for (book of books) {
      if (book.id === bookId) {
        return index;
      }
      index++;
    }
    return -1;
  }

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('ondatasaved'));
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
      books = data;
    }

    document.dispatchEvent(new Event('ondataloaded'));
  }

  function updateDataToStorage() {
    if (isStorageExist()) {
      saveData();
    }
  }

  function createBookElement(bookObject) {
    const { id, title, author, year, isComplete } = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${year}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    if (isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.innerText = 'Belum selesai dibaca';
      undoButton.addEventListener('click', function () {
        undoBookFromCompleted(id);
      });

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = 'Hapus buku';
      deleteButton.addEventListener('click', function () {
        removeBook(id);
      });

      actionContainer.append(undoButton, deleteButton);
    } else {
      const completeButton = document.createElement('button');
      completeButton.classList.add('green');
      completeButton.innerText = 'Selesai dibaca';
      completeButton.addEventListener('click', function () {
        addBookToCompleted(id);
      });

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = 'Hapus buku';
      deleteButton.addEventListener('click', function () {
        removeBook(id);
      });

      actionContainer.append(completeButton, deleteButton);
    }

    container.append(actionContainer);
    return container;
  }

  function addBook() {
    const textBookTitle = document.getElementById('inputBookTitle').value;
    const textBookAuthor = document.getElementById('inputBookAuthor').value;
    const textBookYear = document.getElementById('inputBookYear').value;
    const isBookComplete = document.getElementById(
      'inputBookIsComplete'
    ).checked;

    const generatedID = +new Date();
    const bookObject = generateBookObject(
      generatedID,
      textBookTitle,
      textBookAuthor,
      textBookYear,
      isBookComplete
    );
    books.push(bookObject);

    document.dispatchEvent(new Event('ondatasaved'));
    document.dispatchEvent(new Event('ondataloaded'));

    // Show the modal
    modal.style.display = 'block';
  }

  function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event('ondatasaved'));
    document.dispatchEvent(new Event('ondataloaded'));
  }

  function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event('ondatasaved'));
    document.dispatchEvent(new Event('ondataloaded'));
  }

  function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event('ondatasaved'));
    document.dispatchEvent(new Event('ondataloaded'));
  }

  bookSubmit.addEventListener('click', function (event) {
    event.preventDefault();
    addBook();
    inputBookForm.reset();
  });

  closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.addEventListener('ondatasaved', function () {
    console.log('Data berhasil disimpan.');
  });

  document.addEventListener('ondataloaded', function () {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (book of books) {
      const bookElement = createBookElement(book);
      if (!book.isComplete) incompleteBookshelfList.append(bookElement);
      else completeBookshelfList.append(bookElement);
    }
  });

  const deleteModal = document.getElementById('bookDeletedModal');
  const closeDeleteButton = document.querySelector('.close-delete-button');

  closeDeleteButton.addEventListener('click', function () {
    deleteModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === deleteModal) {
      deleteModal.style.display = 'none';
    }
  });

  function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event('ondatasaved'));
    document.dispatchEvent(new Event('ondataloaded'));

    deleteModal.style.display = 'block';
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
