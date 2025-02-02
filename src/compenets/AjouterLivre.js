import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Card, Spinner, Row, Col, Image } from "react-bootstrap";

const AjouterLivre = () => {
  const [livre, setLivre] = useState({
    Titre: "",
    Auteur: "",
    nbpages: "",
    photo: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLivre({ ...livre, [name]: value });
    setValidated(false);
    // Reset messages when user starts typing
    setMessage(null);
    setError(null);
  };

  const validateForm = () => {
    if (!livre.Titre.trim() || !livre.Auteur.trim() || !livre.nbpages || !livre.photo.trim()) {
      setError("Tous les champs sont obligatoires");
      return false;
    }
    if (parseInt(livre.nbpages) <= 0) {
      setError("Le nombre de pages doit être supérieur à 0");
      return false;
    }
    try {
      new URL(livre.photo);
    } catch {
      setError("L'URL de l'image n'est pas valide");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/listLivres", livre);
      setMessage("Livre ajouté avec succès !");
      setLivre({ Titre: "", Auteur: "", nbpages: "", photo: "" });
      setValidated(false);
      setPreview(false);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Erreur lors de l'ajout du livre. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header as="h5" className="bg-primary text-white">
          Ajouter un Livre
        </Card.Header>
        <Card.Body>
          {message && (
            <Alert variant="success" dismissible onClose={() => setMessage(null)}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="Titre"
                    value={livre.Titre}
                    onChange={handleChange}
                    required
                    placeholder="Entrez le titre du livre"
                  />
                  <Form.Control.Feedback type="invalid">
                    Le titre est requis
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Auteur <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="Auteur"
                    value={livre.Auteur}
                    onChange={handleChange}
                    required
                    placeholder="Nom de l'auteur"
                  />
                  <Form.Control.Feedback type="invalid">
                    L'auteur est requis
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Pages <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="nbpages"
                    value={livre.nbpages}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Entrez le nombre de pages"
                  />
                  <Form.Control.Feedback type="invalid">
                    Le nombre de pages doit être supérieur à 0
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL de l'image <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="url"
                    name="photo"
                    value={livre.photo}
                    onChange={handleChange}
                    required
                    placeholder="https://exemple.com/image.jpg"
                  />
                  <Form.Control.Feedback type="invalid">
                    Une URL valide est requise
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="flex-grow-1"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Ajout en cours...
                  </>
                ) : (
                  "Ajouter Livre"
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setPreview(!preview)}
                disabled={!livre.Titre || !livre.photo}
              >
                {preview ? "Masquer l'aperçu" : "Voir l'aperçu"}
              </Button>
            </div>
          </Form>

          {preview && livre.Titre && livre.photo && (
            <Card className="mt-4">
              <Card.Header>Aperçu du Livre</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Image
                      src={livre.photo}
                      alt={livre.Titre}
                      fluid
                      rounded
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                  </Col>
                  <Col md={8}>
                    <dl className="row">
                      <dt className="col-sm-3">Titre:</dt>
                      <dd className="col-sm-9">{livre.Titre}</dd>

                      <dt className="col-sm-3">Auteur:</dt>
                      <dd className="col-sm-9">{livre.Auteur}</dd>

                      <dt className="col-sm-3">Pages:</dt>
                      <dd className="col-sm-9">{livre.nbpages}</dd>
                    </dl>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AjouterLivre;