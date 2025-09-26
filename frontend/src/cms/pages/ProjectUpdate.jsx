import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProjectList } from '../../services/listService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import image from '../../assets/image/one.jpg';

function ProjectUpdate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;
  const arabicProject = project?.localizations?.find(loc => loc.locale === 'ar');

  // State
  const [tab, setTab] = useState('en');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    amenities: false,
    property_type: false,
    payment_plan: false
  });

  // Default values
  const defaultAmenitiesEn = ['Swimming Pool', 'Gym', 'Sea View', 'Smart Home'];
  const defaultPropertyTypesEn = ['Residential', 'Commercial', 'Mixed-Use'];
  const defaultPaymentPlansEn = ['Financing', 'Down Payment'];

  const defaultAmenitiesAr = ['إطلالة على البحر', 'المنزل الذكي', 'نادي رياضي', 'حمام السباحة'];
  const defaultPropertyTypesAr = ['سكني', 'تجاري', 'متعدد الاستخدامات'];
  const defaultPaymentPlansAr = ['التمويل', 'دفعة مبدئية'];

  const getImageUrl = (img) => {
    if (!img) return image;
    if (Array.isArray(img) && img.length > 0) img = img[0];
    if (img.url) {
      return img.url.startsWith('http')
        ? img.url
        : `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${img.url}`;
    }
    if (typeof img === 'string') return img;
    return image;
  };

  // Form State
  const [form, setForm] = useState({
    title: project?.title || '',
    project_headline: project?.project_headline || '',
    project_description: project?.project_description || '',
    place: project?.place || '',
    building: project?.building || '',
    squarefeet: project?.square_feet || '',
    amenities_en: project?.amenities_en || defaultAmenitiesEn,
    property_type_en: project?.property_type_en || defaultPropertyTypesEn,
    payment_plan_en: project?.payment_plan_en || defaultPaymentPlansEn,
    featured_image: project?.featured_image || null,
    hero_image_desktop: project?.hero_image_desktop || null,
    hero_image_mobile: project?.hero_image_mobile || null,
    gallery_images: project?.gallery_images || [],
    pdf_upload: project?.pdf_upload || null
  });

  // Pending gallery images for preview
  const [pendingGalleryImages, setPendingGalleryImages] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryFileInputRef = useRef(null);
  const pdfFiles = form.pdf_upload;

  const [formAr, setFormAr] = useState({
    title: project?.title_ar || arabicProject?.title || '',
    project_headline: arabicProject?.project_headline || '',
    project_description: arabicProject?.project_description || '',
    place: arabicProject?.place || '',
    building: arabicProject?.building || '',
    squarefeet: arabicProject?.square_feet || '',
    amenities_ar: arabicProject?.amenities_ar || defaultAmenitiesAr,
    property_type_ar: arabicProject?.property_type_ar || defaultPropertyTypesAr,
    payment_plan_ar: arabicProject?.payment_plan_ar || defaultPaymentPlansAr,
    featured_image: null, // Will use English images
    hero_image_desktop: null, // Will use English images
    hero_image_mobile: null, // Will use English images
    gallery_images: [] // Will use English images
  });

  // Effects
  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        project_headline: project.project_headline || '',
        project_description: project.project_description || '',
        place: project.place || '',
        building: project.building || '',
        squarefeet: project.square_feet || '',
        amenities_en: project.amenities_en || defaultAmenitiesEn,
        property_type_en: project.property_type_en || defaultPropertyTypesEn,
        payment_plan_en: project.payment_plan_en || defaultPaymentPlansEn,
        featured_image: project.featured_image || null,
        hero_image_desktop: project.hero_image_desktop || null,
        hero_image_mobile: project.hero_image_mobile || null,
        gallery_images: project.gallery_images || [],
        pdf_upload: project?.pdf_upload || null
      });

      setFormAr(prev => ({
        ...prev,
        title: project.title_ar || arabicProject?.title || '',
        project_headline: arabicProject?.project_headline || '',
        project_description: arabicProject?.project_description || '',
        place: arabicProject?.place || prev.place,
        building: arabicProject?.building || prev.building,
        squarefeet: arabicProject?.square_feet || prev.squarefeet,
        amenities_ar: arabicProject?.amenities_ar || defaultAmenitiesAr,
        property_type_ar: arabicProject?.property_type_ar || defaultPropertyTypesAr,
        payment_plan_ar: arabicProject?.payment_plan_ar || defaultPaymentPlansAr
      }));
    }
  }, [project, arabicProject]);

  // Sync Arabic images with English
  useEffect(() => {
    setFormAr(prev => ({
      ...prev,
      featured_image: form.featured_image,
      hero_image_desktop: form.hero_image_desktop,
      hero_image_mobile: form.hero_image_mobile,
      gallery_images: form.gallery_images
    }));
  }, [form.featured_image, form.hero_image_desktop, form.hero_image_mobile, form.gallery_images]);

  // Handlers
  const handleChange = (e, locale = 'en') => {
    const { name, value } = e.target;
    if (locale === 'en') {
      setForm(prev => ({ ...prev, [name]: value }));
    } else {
      setFormAr(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (field, value, locale = 'en') => {
    if (locale === 'en') {
      setForm(prev => {
        const currentValues = prev[field] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
        return { ...prev, [field]: newValues };
      });
    } else {
      setFormAr(prev => {
        const currentValues = prev[field] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
        return { ...prev, [field]: newValues };
      });
    }
  };

  const handleImageChange = async (e, locale, field) => {
    if (locale !== 'en') {
      toast.error('Images can only be updated from the English tab.');
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const previewUrl = URL.createObjectURL(file);

    try {
      const formData = new FormData();
      formData.append('files', file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data && res.data[0]) {
        const uploadedImage = { id: res.data[0].id, ...res.data[0] };

        setForm(prev => ({ ...prev, [field]: uploadedImage }));

        toast.success('Image uploaded successfully!');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Gallery handlers
  const handleAddGalleryImage = async (e, locale) => {
    if (locale !== 'en') {
      toast.error('Images can only be updated from the English tab.');
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const totalImages = form.gallery_images.length + pendingGalleryImages.length;
    if (totalImages >= 4) {
      toast.error('Maximum 4 images allowed.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPendingGalleryImages(prev => [...prev, { file, previewUrl }]);
    e.target.value = ''; // Reset input
  };

  const handleRemoveGalleryImage = (index, isPending = false) => {
    if (isPending) {
      const removed = pendingGalleryImages[index];
      URL.revokeObjectURL(removed.previewUrl);
      setPendingGalleryImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setForm(prev => ({
        ...prev,
        gallery_images: prev.gallery_images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUploadGallery = async (locale) => {
    if (locale !== 'en' || pendingGalleryImages.length === 0) return;

    setUploadingGallery(true);

    try {
      const formData = new FormData();
      pendingGalleryImages.forEach(({ file }) => formData.append('files', file));

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data && res.data.length > 0) {
        const uploadedImages = res.data.map(file => ({ id: file.id, ...file }));

        // Append to existing, slice to 4
        setForm(prev => ({
          ...prev,
          gallery_images: [...prev.gallery_images, ...uploadedImages].slice(0, 4)
        }));

        // Clear pending and revoke URLs
        pendingGalleryImages.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
        setPendingGalleryImages([]);

        toast.success('Gallery updated!');
      }
    } catch (err) {
      console.error('Gallery upload error:', err);
      toast.error('Failed to upload gallery');
    } finally {
      setUploadingGallery(false);
    }
  };

  // Add PDF Upload Section
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate PDF type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file.');
      return;
    }

    // Validate size (10MB limit)
    const maxSize = 30 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('PDF file size must be less than 10MB.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('files', file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data && res.data[0]) {
        const uploadedFile = { id: res.data[0].id, ...res.data[0] };

        setForm(prev => ({ ...prev, pdf_upload: uploadedFile }));

        toast.success('PDF uploaded successfully!');
      }
    } catch (err) {
      console.error('PDF upload error:', err);
      toast.error('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const renderPdfUpload = (locale) => {
    let pdfFile = form.pdf_upload;
    if (Array.isArray(pdfFile)) pdfFile = pdfFile[0]; // Fallback for legacy array

    return (
      <div className="sm:col-span-2">
        <label>PDF Upload</label>
        {locale === 'en' && (
          <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
        )}
        {pdfFile && (
          <a
            href={pdfFile.url?.startsWith('http')
              ? pdfFile.url
              : `${import.meta.env.VITE_API_URL}${pdfFile.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {pdfFile.name || 'View PDF'}
          </a>
        )}
      </div>
    );
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (!project?.documentId) throw new Error('No document ID available');

    // Always prepare updateData for both locales
    const englishData = {
      place: form.place,
      building: form.building,
      square_feet: Number(form.squarefeet),
      project_headline: form.project_headline,
      project_description: form.project_description,
      amenities_en: form.amenities_en,
      property_type_en: form.property_type_en,
      payment_plan_en: form.payment_plan_en,
      featured_image: form.featured_image?.id ? [form.featured_image.id] : null,
      hero_image_desktop: form.hero_image_desktop?.id ? [form.hero_image_desktop.id] : null,
      hero_image_mobile: form.hero_image_mobile?.id ? [form.hero_image_mobile.id] : null,
      gallery_images: form.gallery_images?.map(img => img.id) || [],
      pdf_upload: form.pdf_upload?.id || null
    };

    const arabicData = {
      place: formAr.place,
      building: formAr.building,
      square_feet: Number(formAr.squarefeet),
      project_headline: formAr.project_headline,
      project_description: formAr.project_description,
      amenities_ar: formAr.amenities_ar,
      property_type_ar: formAr.property_type_ar,
      payment_plan_ar: formAr.payment_plan_ar,
      // Common fields preserved from English
      featured_image: englishData.featured_image,
      hero_image_desktop: englishData.hero_image_desktop,
      hero_image_mobile: englishData.hero_image_mobile,
      gallery_images: englishData.gallery_images,
      pdf_upload: englishData.pdf_upload
    };

    // 🔑 Update both locales regardless of active tab
    await updateProjectList(project.documentId, englishData, 'en');
    await updateProjectList(project.documentId, arabicData, 'ar');

    toast.success('Project updated successfully!');
    setTimeout(() => navigate(-1), 1500);
  } catch (error) {
    toast.error(error.response?.data?.error?.message || error.message);
    console.error('Update error details:', error);
  } finally {
    setLoading(false);
  }
};

  if (!project) return <div className="mt-20 text-center text-gray-600">No project data provided.</div>;

  const getFieldValue = (field, locale) => {
    if (locale === 'ar' && ['featured_image', 'hero_image_desktop', 'hero_image_mobile', 'gallery_images'].includes(field)) {
      return form[field];
    }
    return locale === 'en' ? form[field] : formAr[field];
  };

  const renderDropdownCheckbox = (field, label, locale = 'en') => {
    const fieldName = `${field}_${locale}`;
    const currentValues = locale === 'en' ? form[fieldName] : formAr[fieldName];

    let options = [];
    if (field.includes('amenities')) {
      options = locale === 'en' ? defaultAmenitiesEn : defaultAmenitiesAr;
    } else if (field.includes('property_type')) {
      options = locale === 'en' ? defaultPropertyTypesEn : defaultPropertyTypesAr;
    } else if (field.includes('payment_plan')) {
      options = locale === 'en' ? defaultPaymentPlansEn : defaultPaymentPlansAr;
    }

    return (
      <div className="sm:col-span-2 relative">
        <label className="block mb-2 text-sm font-medium">{label}</label>
        <div
          className="bg-gray-50 border rounded-lg p-2.5 cursor-pointer flex justify-between"
          onClick={() => setDropdownOpen(prev => ({ ...prev, [field]: !prev[field] }))}
        >
          <span>{currentValues.length > 0 ? currentValues.join(', ') : `Select ${label.toLowerCase()}...`}</span>
        </div>
        {dropdownOpen[field] && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              {options.map((option) => (
                <div key={option} className="flex items-center p-2 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    id={`${fieldName}-${option}`}
                    checked={currentValues.includes(option)}
                    onChange={() => handleCheckboxChange(fieldName, option, locale)}
                    className="mr-2"
                  />
                  <label htmlFor={`${fieldName}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white ml-64 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold">Update Project</h2>

        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            type="button"
            className={`px-4 py-2 ${tab === 'en' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setTab('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`px-4 py-2 ${tab === 'ar' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setTab('ar')}
          >
            العربية
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* 1 - Title */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Title' : 'العنوان'}</label>
              <input
                type="text"
                name="title"
                value={getFieldValue('title', tab)}
                onChange={(e) => handleChange(e, tab)}
                disabled
                className="w-full border p-2 rounded-lg"
              />
            </div>

            {/* 2 - Project Headline */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Project Headline' : 'عنوان المشروع'}</label>
              <input
                type="text"
                name="project_headline"
                value={getFieldValue('project_headline', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            {/* 3 - Project Description */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Project Description' : 'وصف المشروع'}</label>
              <textarea
                name="project_description"
                rows="4"
                value={getFieldValue('project_description', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            {/* 4 - Place, Building, Square Feet */}
            <div>
              <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Place' : 'المكان'}</label>
              <input
                type="text"
                name="place"
                value={getFieldValue('place', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Building' : 'المبنى'}</label>
              <input
                type="text"
                name="building"
                value={getFieldValue('building', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Square Feet' : 'قدم مربع'}</label>
              <input
                type="number"
                name="squarefeet"
                value={getFieldValue('squarefeet', tab)}
                onChange={(e) => handleChange(e, tab)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            {/* 5 - Featured Image */}
            <div className="sm:col-span-2 flex gap-4">
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Featured Image' : 'الصورة الرئيسية'}</label>
                {tab === 'en' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, tab, 'featured_image')}
                  />
                )}
              </div>
              <div className="w-1/2">
                <img src={getImageUrl(getFieldValue('featured_image', tab))} className="w-32 h-32 object-cover border rounded-lg" />
              </div>
            </div>

            {/* 6 - Hero Image Desktop */}
            <div className="sm:col-span-2 flex gap-4">
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Hero Image Desktop' : 'صورة البطل - سطح المكتب'}</label>
                {tab === 'en' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, tab, 'hero_image_desktop')}
                  />
                )}
              </div>
              <div className="w-1/2">
                <img src={getImageUrl(getFieldValue('hero_image_desktop', tab))} className="w-32 h-32 object-cover border rounded-lg" />
              </div>
            </div>

            {/* 7 - Hero Image Mobile */}
            <div className="sm:col-span-2 flex gap-4">
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Hero Image Mobile' : 'صورة البطل - الموبايل'}</label>
                {tab === 'en' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, tab, 'hero_image_mobile')}
                  />
                )}
              </div>
              <div className="w-1/2">
                <img src={getImageUrl(getFieldValue('hero_image_mobile', tab))} className="w-32 h-32 object-cover border rounded-lg" />
              </div>
            </div>

            {/* 8 - Gallery Images */}
            <div className="sm:col-span-2 gallery">
              <label className="block mb-2 text-sm font-medium">{tab === 'en' ? 'Gallery Images (max 4)' : 'معرض الصور (4 كحد أقصى)'}</label>
              {tab === 'en' && (
                <>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAddGalleryImage(e, tab)}
                    style={{ display: 'none' }}
                  />
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {Array.from({ length: 4 }).map((_, slotIdx) => {
                      const uploadedImages = getFieldValue('gallery_images', tab);
                      const pendingImages = pendingGalleryImages;
                      const totalImages = uploadedImages.length + pendingImages.length;
                      const image = slotIdx < uploadedImages.length ? uploadedImages[slotIdx] : null;
                      const pending = slotIdx >= uploadedImages.length && slotIdx < totalImages ? pendingImages[slotIdx - uploadedImages.length] : null;

                      return (
                        <div key={slotIdx} className="relative w-20 h-20  border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          {image ? (
                            <>
                              <img src={getImageUrl(image)} className="w-full h-full object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(slotIdx, false)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                              >
                                ×
                              </button>
                            </>
                          ) : pending ? (
                            <>
                              <img src={pending.previewUrl} className="w-full h-full object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(slotIdx - uploadedImages.length, true)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center z-70"
                              >
                                ×
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => galleryFileInputRef.current?.click()}
                              className="text-gray-500 text-2xl"
                            >
                              +
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {pendingGalleryImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleUploadGallery(tab)}
                      disabled={uploadingGallery}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      {uploadingGallery ? 'Uploading...' : 'Upload Gallery'}
                    </button>
                  )}
                </>
              )}
              {tab === 'ar' && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {getFieldValue('gallery_images', tab).slice(0, 4).map((img, idx) => (
                    <img key={idx} src={getImageUrl(img)} className="w-20 h-20 object-cover border rounded-lg" />
                  ))}
                </div>
              )}
            </div>

            {/* 9, 10, 11 - Dropdowns */}
            {tab === 'en' ? (
              <>
                {renderDropdownCheckbox('amenities', 'Amenities', 'en')}
                {renderDropdownCheckbox('property_type', 'Property Type', 'en')}
                {renderDropdownCheckbox('payment_plan', 'Payment Plan', 'en')}
              </>
            ) : (
              <>
                {renderDropdownCheckbox('amenities', 'المرافق', 'ar')}
                {renderDropdownCheckbox('property_type', 'نوع العقار', 'ar')}
                {renderDropdownCheckbox('payment_plan', 'خطة الدفع', 'ar')}
              </>
            )}

            {/* PDF Upload Section */}
            {renderPdfUpload(tab)}
          </div>

          <button type="submit" disabled={loading} className="export-button mt-6">
            {loading ? (tab === 'en' ? 'Updating...' : 'جارٍ التحديث...') : (tab === 'en' ? 'Update Project' : 'تحديث المشروع')}
          </button>
        </form>
        <ToastContainer position={tab === 'ar' ? 'top-left' : 'top-right'} />
      </div>
    </section>
  );
}

export default ProjectUpdate; 