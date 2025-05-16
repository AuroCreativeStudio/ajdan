import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Textarea,
} from '@material-tailwind/react';

const ContactForm = ({ show, onClose, listingTitle }) => {
  const initialFormData = {
    username: '',
    email: '',
    phone: '',
    title: listingTitle,
    message: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (show) {
      setFormData({ ...initialFormData, title: listingTitle });
    }
  }, [show, listingTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:1337/api/project-contact-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });
      alert('Submitted successfully!');
      setFormData({ ...initialFormData, title: listingTitle }); // Reset form
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Dialog
      size="xs"
      open={show}
      handler={onClose}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem]">

            <Typography variant="h4" color="white">
            Contact Us
          </Typography>
        <form onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Title"
              name="title"
              value={formData.title}
              readOnly
              className="cursor-not-allowed"
            />
            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </CardBody>
          <CardFooter className="pt-0 flex flex-col gap-2">
            <Button type="submit" variant="gradient" fullWidth>
              Submit
            </Button>
            <Button onClick={onClose} variant="text" color="gray" fullWidth>
              Close
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Dialog>
  );
};

export default ContactForm;
