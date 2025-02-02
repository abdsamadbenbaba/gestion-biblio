import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from "react-bootstrap";
import debounce from "lodash/debounce";

const Rechercher = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/listLivres");
        setList(response.data);
        setFilteredList(response.data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des livres : " + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLivres();
  }, []);

  const handleShowDetails = (livre) => {
    setSelectedLivre(livre);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm === "") {
        setFilteredList(list);
      } else {
        const normalizedSearch = searchTerm.toLowerCase().trim();
        setFilteredList(
          list.filter(
            (livre) =>
              livre.Titre.toLowerCase().includes(normalizedSearch) ||
              livre.Auteur.toLowerCase().includes(normalizedSearch)
          )
        );
      }
    }, 300),
    [list]
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, debouncedSearch]);

  if (isLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">Chargement...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Rechercher un Livre</h2>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Form className="mb-4">
        <Form.Group controlId="search">
          <Form.Label>Rechercher par titre ou auteur :</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez votre recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Champ de recherche"
          />
        </Form.Group>
      </Form>

      <Row>
        {filteredList.length > 0 ? (
          filteredList.map((livre) => (
            <Col key={livre.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={livre.photo}
                  alt={livre.Titre}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/placeholder-book.jpg";
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{livre.Titre}</Card.Title>
                  <Card.Text>
                    <strong>Auteur:</strong> {livre.Auteur} <br />
                    <strong>Nombre de pages:</strong> {livre.nbpages}
                  </Card.Text>
                  <Button variant="primary" className="me-2" onClick={() => handleShowDetails(livre)}>
                    Voir Détails
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p>Aucun livre ne correspond à votre recherche.</p>
          </Col>
        )}
      </Row>

      {/* Modal for displaying book details */}
      <Modal show={showDetails} onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedLivre?.Titre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLivre && (
            <>
              <p>
                <strong>Auteur:</strong> {selectedLivre.Auteur}
              </p>
              <p>
                <strong>Nombre de pages:</strong> {selectedLivre.nbpages}
              </p>
              <img
                src={selectedLivre.photo}
                alt={selectedLivre.Titre}
                style={{ width: "100%", height: "auto" }}
                onError={(e) => {
                  e.target.src = "/placeholder-book.jpg";
                }}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Rechercher;