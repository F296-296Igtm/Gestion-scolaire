import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyAC5XlcpnhduauHiN9u-ML7fEBkSuHKAkg",

    authDomain:
        "gestion-scolaire-ac269.firebaseapp.com",

    projectId:
        "gestion-scolaire-ac269",

    storageBucket:
        "gestion-scolaire-ac269.firebasestorage.app",

    messagingSenderId:
        "237667733638",

    appId:
        "1:237667733638:web:70a38ef93403fc718bc107"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// =====================================================
// CACHER LES SECTIONS
// =====================================================

function cacherSections() {

    document.getElementById("sectionAccueil").style.display = "none";

    document.getElementById("sectionEleves").style.display = "none";

    document.getElementById("sectionEnseignants").style.display = "none";

    document.getElementById("sectionClasses").style.display = "none";

    document.getElementById("sectionMatieres").style.display = "none";

    document.getElementById("sectionNotes").style.display = "none";
}


// =====================================================
// ACCUEIL
// =====================================================

function afficherAccueil() {

    cacherSections();

    document.getElementById("sectionAccueil").style.display = "block";

    mettreAJourStatistiques();
}


// =====================================================
// ÉLÈVES
// =====================================================

async function afficherEleves() {

    cacherSections();

    document.getElementById("sectionEleves").style.display = "block";

    await afficherElevesSauvegardes();
}


// =====================================================
// AJOUTER UN ÉLÈVE
// =====================================================

async function ajouterEleve() {

    const nom =
        document.getElementById("nomEleve").value.trim();

    const prenom =
        document.getElementById("prenomEleve").value.trim();

    const classe =
        document.getElementById("classeEleve").value.trim();


    if (
        nom === "" ||
        prenom === "" ||
        classe === ""
    ) {

        alert("Veuillez remplir tous les champs.");

        return;
    }


    try {

        await addDoc(
            collection(db, "eleves"),
            {
                nom: nom,
                prenom: prenom,
                classe: classe,
                dateAjout: new Date()
            }
        );


        alert("Élève ajouté avec succès !");


        document.getElementById("nomEleve").value = "";

        document.getElementById("prenomEleve").value = "";

        document.getElementById("classeEleve").value = "";


        await afficherElevesSauvegardes();

        await mettreAJourStatistiques();

    }

    catch (erreur) {

        console.error(
            "Erreur Firebase :",
            erreur
        );

        alert(
            "Erreur : impossible d'enregistrer l'élève."
        );
    }
}




async function afficherElevesSauvegardes() {

    const tableau =
        document.getElementById("listeEleves");


    if (!tableau) {
        return;
    }


    tableau.innerHTML = "";


    try {

        const resultat =
            await getDocs(
                collection(db, "eleves")
            );


        let numero = 1;

…
