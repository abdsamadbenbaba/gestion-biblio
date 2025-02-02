// SupprimerLivres.js
import axios from "axios";

export const SupprimerLivres = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/listLivres/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    throw new Error("Erreur lors de la suppression du livre : " + (error.response?.data?.message || error.message));
  }
};

// Bonus: Vous pouvez aussi créer un fichier de configuration pour centraliser les URLs
// api.config.js
export const API_BASE_URL = 'http://localhost:3000';
export const API_ENDPOINTS = {
  LIST_BOOKS: `${API_BASE_URL}/listLivres`,
  DELETE_BOOK: (id) => `${API_BASE_URL}/listLivres/${id}`,
};