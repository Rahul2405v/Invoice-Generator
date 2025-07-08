import axios from 'axios';

export const uploadPDF = async (pdfBlob) => {
  const formData = new FormData();
  formData.append('file', pdfBlob);
  formData.append('upload_preset', 'logo_invoice'); // Use the same or a new preset
  formData.append('resource_type', 'raw'); // Required for PDF and other non-image formats

  const res = await axios.post(
    'https://api.cloudinary.com/***********',
    formData
  );

  return res.data.secure_url;
};
