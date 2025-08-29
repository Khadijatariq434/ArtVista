import { useEffect, useState } from "react";
import { useArt } from "../context/ArtContext";
import { X, Edit3, Trash2, ImageIcon, Plus, Upload } from "lucide-react";

const ManageArt = () => {
  const { myArts, getMyArts, addArt, updateArt, deleteArt, loading } = useArt();
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    price: "", 
    categories: [] 
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [artToDeleteId, setArtToDeleteId] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([
    "painting",
    "digital",
    "sculpture",
    "photography",
    "drawing",
    "mixed media",
    "print",
    "textile"
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    getMyArts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, value]
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(cat => cat !== value)
      });
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !availableCategories.includes(newCategory.trim().toLowerCase())) {
      setAvailableCategories([...availableCategories, newCategory.trim().toLowerCase()]);
      setNewCategory("");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImagePreview = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    
    if (newImages.length === 0) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("categories", formData.categories.join(","));
    
    for (let img of images) {
      fd.append("images", img);
    }

    try {
      if (editingId) {
        await updateArt(editingId, fd);
        setEditingId(null);
      } else {
        await addArt(fd);
      }

      setFormData({ title: "", description: "", price: "", categories: [] });
      setImages([]);
      setImagePreviews([]);
      setIsFormOpen(false);
      getMyArts();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (art) => {
    setEditingId(art._id);
    setFormData({
      title: art.title,
      description: art.description,
      price: art.price,
      categories: art.categories || []
    });
    setImagePreviews(art.images || []);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setArtToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    if (artToDeleteId) {
      await deleteArt(artToDeleteId);
      getMyArts();
      setIsConfirmOpen(false);
      setArtToDeleteId(null);
    }
    setDeleteLoading(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setArtToDeleteId(null);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", categories: [] });
    setImages([]);
    setImagePreviews([]);
    setEditingId(null);
    setIsFormOpen(false);
    setNewCategory("");
  };

  const isOverlayOpen = isFormOpen || isConfirmOpen;

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-6 relative">
      <div className={`max-w-6xl mx-auto transition ${isOverlayOpen ? "blur-sm" : ""}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#3a302c] tracking-wide">Manage Your Art Collection</h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center bg-[#8a4b3c] text-white px-4 py-2 rounded-md hover:bg-[#723c2f] transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add New Art
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a4b3c]"></div>
          </div>
        ) : myArts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-[#e8e1d9]">
            <ImageIcon className="h-16 w-16 text-[#d3c8be] mx-auto mb-4" />
            <h3 className="text-xl font-medium text-[#6e635c] mb-2">No artwork yet</h3>
            <p className="text-[#9c9087] mb-4">Start by adding your first piece of art</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#8a4b3c] text-white px-4 py-2 rounded-md hover:bg-[#723c2f] transition-colors"
            >
              Add Your First Artwork
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myArts.map((art) => (
              <div key={art._id} className="bg-white rounded-lg overflow-hidden border border-[#e8e1d9] transition-all hover:shadow-md">
                {art.images && art.images.length > 0 ? (
                  <img src={art.images[0]} alt={art.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-[#f3ebe5] flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-[#d3c8be]" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-[#3a302c] mb-1 truncate">{art.title}</h3>
                  <p className="text-sm text-[#6e635c] mb-2 line-clamp-2 h-10">{art.description}</p>
                  
                  {art.categories && art.categories.length > 0 && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {art.categories.map((category, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 bg-[#f3ebe5] text-[#8a4b3c] text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="font-bold text-[#8a4b3c]">₹{art.price}</p>
                  <div className="flex justify-between mt-4 pt-3 border-t border-[#e8e1d9]">
                    <button
                      onClick={() => handleEdit(art)}
                      className="flex items-center text-[#6a8e7f] hover:text-[#577467] transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(art._id)}
                      className="flex items-center text-[#d15c4f] hover:text-[#b44c40] transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(isFormOpen || isConfirmOpen) && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md border border-[#e8e1d9] shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-[#e8e1d9] sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-[#3a302c]">{editingId ? "Edit Artwork" : "Add New Artwork"}</h3>
              <button onClick={resetForm} className="text-[#6e635c] hover:text-[#3a302c] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3a302c] mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Artwork title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border border-[#e8e1d9] p-2 w-full rounded-md focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a302c] mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your artwork"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="border border-[#e8e1d9] p-2 w-full rounded-md focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a302c] mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="border border-[#e8e1d9] p-2 w-full rounded-md focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3a302c] mb-2">Categories</label>
                <div className="grid grid-cols-2 gap-2 mb-3 max-h-32 overflow-y-auto p-1">
                  {availableCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 text-sm text-[#6e635c]">
                      <input
                        type="checkbox"
                        value={category}
                        checked={formData.categories.includes(category)}
                        onChange={handleCategoryChange}
                        className="rounded border-[#e8e1d9] text-[#8a4b3c] focus:ring-[#8a4b3c]"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 border border-[#e8e1d9] p-2 rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-3 py-2 bg-[#f3ebe5] text-[#8a4b3c] rounded-md hover:bg-[#e8ddd4] transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                
                {formData.categories.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-[#6e635c] mb-1">Selected categories:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.categories.map((category, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 bg-[#f3ebe5] text-[#8a4b3c] text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3a302c] mb-1">Images</label>
                
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-[#6e635c] mb-2">Selected images:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImagePreview(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#d3c8be] rounded-md cursor-pointer hover:bg-[#f8f5f0] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-[#d3c8be]" />
                      <p className="mb-2 text-sm text-[#6e635c]">Click to upload images</p>
                      <p className="text-xs text-[#9c9087]">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleImageChange} 
                      className="hidden" 
                      accept="image/png,image/jpeg,image/jpg"
                    />
                  </label>
                </div>
                {images.length > 0 && (
                  <p className="mt-2 text-sm text-[#6a8e7f]">{images.length} file(s) selected</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white pb-4 border-t border-[#e8e1d9] ">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-[#e8e1d9] text-[#6e635c] rounded-md hover:bg-[#f8f5f0] transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8a4b3c] text-white rounded-md hover:bg-[#723c2f] transition-colors flex items-center justify-center min-w-24"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : editingId ? (
                    "Update Artwork"
                  ) : (
                    "Add Artwork"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-xs border border-[#e8e1d9] shadow-lg p-6 text-center">
            <p className="text-lg font-semibold text-[#3a302c] mb-4">Are you sure?</p>
            <p className="text-sm text-[#6e635c] mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-[#e8e1d9] text-[#6e635c] rounded-md hover:bg-[#f8f5f0] transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#d15c4f] text-white rounded-md hover:bg-[#b44c40] transition-colors flex items-center justify-center min-w-20"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageArt;