import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Navbarlivre = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="p-3">
            <Container>
                {/* Titre de la barre de navigation */}
                <Navbar.Brand as={Link} to="/liste-livres">
                    Gestion des Livres
                </Navbar.Brand>

                {/* Menu de navigation responsive */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/ajouter-livre">Ajouter un Livre</Nav.Link>
                        <Nav.Link as={Link} to="/">Formulaire de Livre</Nav.Link>
                        <Nav.Link as={Link} to="/rechercher">Rechercher un Livre</Nav.Link>
                        <Nav.Link as={Link} to="/supprimer-livre">Supprimer des Livres</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navbarlivre;
