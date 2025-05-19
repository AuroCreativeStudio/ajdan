// services/projectPopupService.js
export const fetchProjectPopups = async () => {
  const response = await fetch(`http://localhost:1337/api/project-contact-forms`);
  if (!response.ok) throw new Error('Failed to fetch popups');
  return await response.json();
};

