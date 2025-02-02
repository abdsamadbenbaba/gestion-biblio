import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Alert, 
  Modal, 
  Spinner,
  Badge,
  Form,
  InputGroup
} from "react-bootstrap";
import { SupprimerLivres } from "./SupprimerLivres";

const ListeLivres = () => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("titre");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/listLivres");
        setList(response.data);
        setError(null);
      } catch (err) {
        setError(
          "Erreur lors du chargement des livres : " + 
          (err.response?.data?.message || err.message)
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLivres();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(id);
      await SupprimerLivres(id);
      setList(prevList => prevList.filter(livre => livre.id !== id));
      setError(null);
    } catch (err) {
      setError(
        "Erreur lors de la suppression : " + 
        (err.response?.data?.message || err.message)
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleShowDetails = (livre) => {
    setSelectedLivre(livre);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedLivre(null);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const filteredAndSortedList = list
    .filter(livre => 
      livre.Titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.Auteur.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "titre") {
        return a.Titre.localeCompare(b.Titre);
      } else if (sortBy === "auteur") {
        return a.Auteur.localeCompare(b.Auteur);
      } else if (sortBy === "pages") {
        return a.nbpages - b.nbpages;
      }
      return 0;
    });

  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement de la bibliothèque...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          Bibliothèque
          <Badge bg="primary" className="ms-2">
            {filteredAndSortedList.length}
          </Badge>
        </h2>
        <Button variant="outline-primary" onClick={handleRefresh}>
          Rafraîchir
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Rechercher par titre ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="titre">Trier par titre</option>
                <option value="auteur">Trier par auteur</option>
                <option value="pages">Trier par nombre de pages</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {filteredAndSortedList.length > 0 ? (
          filteredAndSortedList.map((livre) => (
            <Col key={livre.id} md={4} className="d-flex">
              <Card className="w-100 shadow-sm hover-shadow transition-all">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={livre.photo}
                    alt={livre.Titre}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x300?text=Livre";
                    }}
                  />
                  <Badge 
                    bg="info" 
                    className="position-absolute top-0 end-0 m-2"
                  >
                    {livre.nbpages} pages
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{livre.Titre}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {livre.Auteur}
                  </Card.Subtitle>
                  <div className="mt-auto pt-3 d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      className="flex-grow-1"
                      onClick={() => handleShowDetails(livre)}
                    >
                      Détails
                    </Button>
                    <Button
                      variant="outline-danger"
                      disabled={deleteLoading === livre.id}
                      onClick={() => {
                        if (window.confirm(
                          `Êtes-vous sûr de vouloir supprimer "${livre.Titre}" ?`
                        )) {
                          handleDelete(livre.id);
                        }
                      }}
                    >
                      {deleteLoading === livre.id ? (
                        <Spinner 
                          as="span" 
                          animation="border" 
                          size="sm" 
                        />
                      ) : (
                        <i className="bi bi-trash"></i>
                      )}
                      Supprimer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <i className="bi bi-book display-1 text-muted"></i>
            <p className="lead mt-3">
              {searchTerm 
                ? "Aucun livre ne correspond à votre recherche." 
                : "Aucun livre disponible."}
            </p>
          </Col>
        )}
      </Row>

      <Modal 
        show={showDetails} 
        onHide={handleCloseDetails}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du livre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLivre && (
            <Row>
              <Col md={5}>
                <img
                  src={selectedLivre.photo}
                  alt={selectedLivre.Titre}
                  className="img-fluid rounded shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x400?text=Livre";
                  }}
                />
              </Col>
              <Col md={7}>
                <h4>{selectedLivre.Titre}</h4>
                <dl className="row mt-3">
                  <dt className="col-sm-4">Auteur</dt>
                  <dd className="col-sm-8">{selectedLivre.Auteur}</dd>

                  <dt className="col-sm-4">Nombre de pages</dt>
                  <dd className="col-sm-8">
                    {selectedLivre.nbpages}
                    <Badge bg="info" className="ms-2">
                      {selectedLivre.nbpages > 500 ? 'Long' : 'Court'}
                    </Badge>
                  </dd>

                  <dt className="col-sm-4">Identifiant</dt>
                  <dd className="col-sm-8">
                    <code>{selectedLivre.id}</code>
                  </dd>
                </dl>
              </Col>
            </Row>
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

export default ListeLivres;