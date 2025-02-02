import React, { useState } from 'react';

const FormLiver = () => {
  const [formData, setFormData] = useState({
    titre: "",
    number: "",
    photo: "",
    auteur: ""
  });
  const [massg, setMassg] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Reset validation state when user starts typing
    setValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    setValidated(true);
    
    if (!formData.titre || !formData.number || !formData.photo || !formData.auteur) {
      setMassg("Remplissez tous les champs");
      return;
    }

    // Simulate API call
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      setMassg("Envoi réussi");
      setFormData({
        titre: "",
        number: "",
        photo: "",
        auteur: ""
      });
      setValidated(false);
    } catch (error) {
      setMassg("Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0"> Form for livre</h4>
            </div>
            <div className="card-body">
              {massg && (
                <div className={`alert ${massg === "Envoi réussi" ? "alert-success" : "alert-danger"} alert-dismissible fade show`}>
                  {massg}
                  <button type="button" className="btn-close" onClick={() => setMassg("")}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate>
                <div className="mb-3">
                  <label htmlFor="titre" className="form-label">Titre <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    required
                    placeholder="Entrez le titre du livre"
                  />
                  <div className="invalid-feedback">Le titre est requis</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="number" className="form-label">Nombre de pages <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Entrez le nombre de pages"
                  />
                  <div className="invalid-feedback">Le nombre de pages doit être supérieur à 0</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="photo" className="form-label">URL de la photo <span className="text-danger">*</span></label>
                  <input
                    type="url"
                    className="form-control"
                    id="photo"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    required
                    placeholder="https://exemple.com/image.jpg"
                  />
                  <div className="invalid-feedback">Veuillez entrer une URL valide</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="auteur" className="form-label">Auteur <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="auteur"
                    name="auteur"
                    value={formData.auteur}
                    onChange={handleChange}
                    required
                    placeholder="Nom de l'auteur"
                  />
                  <div className="invalid-feedback">L'auteur est requis</div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Envoi en cours...
                    </>
                  ) : 'Soumettre'}
                </button>
              </form>
            </div>
          </div>

          {formData.titre && formData.number && formData.photo && formData.auteur && (
            <div className="card mt-4 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Aperçu du Livre</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <img 
                      src={formData.photo} 
                      alt="photo du livre" 
                      className="img-fluid rounded mb-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th scope="row" className="text-muted">Titre:</th>
                          <td>{formData.titre}</td>
                        </tr>
                        <tr>
                          <th scope="row" className="text-muted">Pages:</th>
                          <td>{formData.number}</td>
                        </tr>
                        <tr>
                          <th scope="row" className="text-muted">Auteur:</th>
                          <td>{formData.auteur}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormLiver;