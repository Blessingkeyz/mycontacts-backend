const asyncHandler = require("express-async-handler");

const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route Get /api/contacts
// @access private

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @desc Get individual contacts
// @route Get /api/contacts/:id
// @access private

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("contact not found");
  }
  res.status(200).json(contact);
});

// @desc Create contacts
// @route Post /api/contacts
// @access private

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is: ", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

// @desc Edit contacts
// @route Put /api/contacts/:id
// @access private

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("contact not found");
  }
  if (contact.user_id.toString() != req.user.id) {
    res.status(403);
    throw new Error(
      "User doesn't have permision to update other  user contacts"
    );
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});
// @desc Delete contacts
// @route Delete /api/contacts/:id
// @access private

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("contact not found");
  }
  if (contact.user_id.toString() != req.user.id) {
    res.status(403);
    throw new Error(
      "User doesn't have permision to delete other user contacts"
    );
  }
  await contact.deleteOne({ _id: req.params.id });
  res.status(200).json(`removed contact for ${contact.name}`);
});

module.exports = {
  getContact,
  getContacts,
  updateContact,
  deleteContact,
  createContact,
};
