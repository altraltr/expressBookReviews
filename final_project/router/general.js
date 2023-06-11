const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({
                "username": username,
                "password": password
            });
            return res.status(200).json({
                message: "User successfully registred. Now you can login"
            });
        } else {
            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }
    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Get the book list available in the shop
public_users.get('/', async function(req, res) {
    try {
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function(req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Get book details based on author
public_users.get('/author/:author', async function(req, res) {
    try {
        const author = req.params.author;
        const booksOfAuthor = [];

        for (const isbn in books) {
            if (books.hasOwnProperty(isbn)) {
                const book = books[isbn];
                if (book.author === author) {
                    booksOfAuthor.push(book);
                }
            }
        }

        if (booksOfAuthor.length === 0) {
            return res.status(404).json({
                message: 'No books found for the specified author'
            });
        }

        return res.status(200).send(JSON.stringify(booksOfAuthor, null, 4));
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


// Get all books based on title
public_users.get('/title/:title', async function(req, res) {
    try {
        const title = req.params.title;
        const booksWithTitle = [];

        for (const isbn in books) {
            if (books.hasOwnProperty(isbn)) {
                const book = books[isbn];
                if (book.title === title) {
                    booksWithTitle.push(book);
                }
            }
        }

        if (booksWithTitle.length === 0) {
            return res.status(404).json({
                message: 'No books found for the specified title'
            });
        }

        return res.status(200).send(JSON.stringify(booksWithTitle, null, 4));
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


//  Get book review
public_users.get('/review/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    const reviews = book.reviews;
    return res.status(200).json({
        reviews
    });
});

module.exports.general = public_users;