import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAC5XlcpnhduauHiN9u-ML7fEBkSuHKAkg",
    authDomain: "gestion-scolaire-ac269.firebaseapp.com",
    projectId: "gestion-scolaire-ac269",
    storageBucket: "gestion-scolaire-ac269.firebasestorage.app",
    messagingSenderId: "237667733638",
    appId: "1:237667733638:web:70a38ef93403fc718bc107"
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


async function afficherEleves() {

    cacherSections();

    document.getElementById("sectionEleves").style.display = "block";

    await afficherElevesSauvegardes();
}


async function ajouterEleve() {

    let nom =
        document.getElementById("nomEleve").value.trim();

    let prenom =
        document.getElementById("prenomEleve").value.trim();

    let classe =
        document.getElementById("classeEleve").value.trim();


    if (nom === "" || prenom === "" || classe === "") {

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

        mettreAJourStatistiques();

    }

    catch (erreur) {

        console.error("Erreur Firebase :", erreur);

        alert("Impossible d'enregistrer l'élève.");
    }
}


async function afficherElevesSauvegardes() {

    let tableau =
        document.getElementById("listeEleves");


    if (!tableau) return;


    tableau.innerHTML = "";


    try {

        const resultat =
            await getDocs(collection(db, "eleves"));


        let index = 1;


        resultat.forEach(function(documentFirebase) {

            let eleve =
                documentFirebase.data();


            let ligne =
                tableau.insertRow();


            ligne.insertCell(0).textContent =
                index;


            ligne.insertCell(1).textContent =
                eleve.nom;


            ligne.insertCell(2).textContent =
                eleve.prenom;


            ligne.insertCell(3).textContent =
                eleve.classe;


            let actions =
                ligne.insertCell(4);


            actions.innerHTML = `

                <button
                    class="btn-supprimer"
                    onclick="supprimerEleve('${documentFirebase.id}')">
                    🗑️
                </button>

            `;


            index++;

        });

    }

    catch (erreur) {

        console.error(
            "Erreur lors du chargement des élèves :",
            erreur
        );

        alert(
            "Impossible de charger les élèves."
        );
    }
}


// =====================================================
// SUPPRIMER UN ÉLÈVE FIRESTORE
// =====================================================

async function supprimerEleve(id) {

    if (
        confirm(
            "Voulez-vous vraiment supprimer cet élève ?"
        )
    ) {

        try {

            await deleteDoc(
                doc(db, "eleves", id)
            );


            alert("Élève supprimé.");


            await afficherElevesSauvegardes();

            mettreAJourStatistiques();

        }

        catch (erreur) {

            console.error(
                "Erreur suppression :",
                erreur
            );

            alert(
                "Impossible de supprimer l'élève."
            );
        }
    }
}


// =====================================================
// VIDER TOUS LES ÉLÈVES
// =====================================================

async function viderEleves() {

    if (
        !confirm(
            "Voulez-vous vraiment supprimer tous les élèves ?"
        )
    ) {

        return;
    }


    try {

        const resultat =
            await getDocs(
                collection(db, "eleves")
            );


        for (
            const documentFirebase
            of resultat.docs
        ) {

            await deleteDoc(
                doc(
                    db,
                    "eleves",
                    documentFirebase.id
                )
            );
        }


        alert("Tous les élèves ont été supprimés.");


        await afficherElevesSauvegardes();

        mettreAJourStatistiques();

    }

    catch (erreur) {

        console.error(
            "Erreur :",
            erreur
        );

        alert(
            "Impossible de vider la liste."
        );
    }
}


// =====================================================
// ENSEIGNANTS
// =====================================================

function afficherEnseignants() {

    cacherSections();

    document.getElementById(
        "sectionEnseignants"
    ).style.display = "block";

    afficherEnseignantsSauvegardes();
}


function ajouterEnseignant() {

    let nom =
        document.getElementById(
            "nomEnseignant"
        ).value.trim();


    let matiere =
        document.getElementById(
            "matiereEnseignant"
        ).value.trim();


    if (
        nom === "" ||
        matiere === ""
    ) {

        alert(
            "Veuillez remplir tous les champs."
        );

        return;
    }


    let enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    enseignants.push({

        nom: nom,

        matiere: matiere

    });


    localStorage.setItem(
        "enseignants",
        JSON.stringify(
            enseignants
        )
    );


    document.getElementById(
        "nomEnseignant"
    ).value = "";


    document.getElementById(
        "matiereEnseignant"
    ).value = "";


    afficherEnseignantsSauvegardes();

    mettreAJourStatistiques();
}


function afficherEnseignantsSauvegardes() {

    let enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    let liste =
        document.getElementById(
            "listeEnseignants"
        );


    if (!liste) return;


    liste.innerHTML = "";


    enseignants.forEach(
        function(
            enseignant,
            index
        ) {

            let li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <span>
                    👨‍🏫
                    ${enseignant.nom}
                    — ${enseignant.matiere}
                </span>

                <button
                    class="btn-supprimer"
                    onclick="supprimerEnseignant(${index})">
                    🗑️
                </button>

            `;


            liste.appendChild(li);

        }
    );
}


function supprimerEnseignant(index) {

    let enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    if (
        confirm(
            "Supprimer cet enseignant ?"
        )
    ) {

        enseignants.splice(
            index,
            1
        );


        localStorage.setItem(
            "enseignants",
            JSON.stringify(
                enseignants
            )
        );


        afficherEnseignantsSauvegardes();

        mettreAJourStatistiques();
    }
}


// =====================================================
// CLASSES
// =====================================================

function afficherClasses() {

    cacherSections();

    document.getElementById(
        "sectionClasses"
    ).style.display = "block";

    afficherClassesSauvegardees();
}


function ajouterClasse() {

    let nom =
        document.getElementById(
            "nomClasse"
        ).value.trim();


    if (nom === "") {

        alert(
            "Veuillez entrer une classe."
        );

        return;
    }


    let classes =
        JSON.parse(
            localStorage.getItem(
                "classes"
            )
        ) || [];


    classes.push(nom);


    localStorage.setItem(
        "classes",
        JSON.stringify(
            classes
        )
    );


    document.getElementById(
        "nomClasse"
    ).value = "";


    afficherClassesSauvegardees();

    mettreAJourStatistiques();
}


function afficherClassesSauvegardees() {

    let classes =
        JSON.parse(
            localStorage.getItem(
                "classes"
            )
        ) || [];


    let liste =
        document.getElementById(
            "listeClasses"
        );


    if (!liste) return;


    liste.innerHTML = "";


    classes.forEach(
        function(
            classe,
            index
        ) {

            let li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <span>
                    🏫 ${classe}
                </span>

                <button
                    class="btn-supprimer"
                    onclick="supprimerClasse(${index})">
                    🗑️
                </button>

            `;


            liste.appendChild(li);

        }
    );
}


function supprimerClasse(index) {

    let classes =
        JSON.parse(
            localStorage.getItem(
                "classes"
            )
        ) || [];


    if (
        confirm(
            "Supprimer cette classe ?"
        )
    ) {

        classes.splice(
            index,
            1
        );


        localStorage.setItem(
            "classes",
            JSON.stringify(
                classes
            )
        );


        afficherClassesSauvegardees();

        mettreAJourStatistiques();
    }
}


// =====================================================
// MATIÈRES
// =====================================================

function afficherMatieres() {

    cacherSections();

    document.getElementById(
        "sectionMatieres"
    ).style.display = "block";

    afficherMatieresSauvegardees();
}


function ajouterMatiere() {

    let matiere =
        document.getElementById(
            "nomMatiere"
        ).value.trim();


    if (matiere === "") {

        alert(
            "Veuillez entrer une matière."
        );

        return;
    }


    let matieres =
        JSON.parse(
            localStorage.getItem(
                "matieres"
            )
        ) || [];


    matieres.push(matiere);


    localStorage.setItem(
        "matieres",
        JSON.stringify(
            matieres
        )
    );


    document.getElementById(
        "nomMatiere"
    ).value = "";


    afficherMatieresSauvegardees();

    mettreAJourStatistiques();
}


function afficherMatieresSauvegardees() {

    let matieres =
        JSON.parse(
            localStorage.getItem(
                "matieres"
            )
        ) || [];


    let liste =
        document.getElementById(
            "listeMatieres"
        );


    if (!liste) return;


    liste.innerHTML = "";


    matieres.forEach(
        function(
            matiere,
            index
        ) {

            let li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <span>
                    📚 ${matiere}
                </span>

                <button
                    class="btn-supprimer"
                    onclick="supprimerMatiere(${index})">
                    🗑️
                </button>

            `;


            liste.appendChild(li);

        }
    );
}


function supprimerMatiere(index) {

    let matieres =
        JSON.parse(
            localStorage.getItem(
                "matieres"
            )
        ) || [];


    if (
        confirm(
            "Supprimer cette matière ?"
        )
    ) {

        matieres.splice(
            index,
            1
        );


        localStorage.setItem(
            "matieres",
            JSON.stringify(
                matieres
            )
        );


        afficherMatieresSauvegardees();

        mettreAJourStatistiques();
    }
}


// =====================================================
// NOTES
// =====================================================

function afficherNotes() {

    cacherSections();

    document.getElementById(
        "sectionNotes"
    ).style.display = "block";

    afficherNotesSauvegardees();
}


function ajouterNote() {

    let eleve =
        document.getElementById(
            "nomEleveNote"
        ).value.trim();


    let note =
        document.getElementById(
            "noteEleve"
        ).value;


    if (
        eleve === "" ||
        note === ""
    ) {

        alert(
            "Veuillez remplir tous les champs."
        );

        return;
    }


    note = Number(note);


    if (
        note < 0 ||
        note > 20
    ) {

        alert(
            "La note doit être comprise entre 0 et 20."
        );

        return;
    }


    let notes =
        JSON.parse(
            localStorage.getItem(
                "notes"
            )
        ) || [];


    notes.push({

        eleve: eleve,

        note: note

    });


    localStorage.setItem(
        "notes",
        JSON.stringify(
            notes
        )
    );


    document.getElementById(
        "nomEleveNote"
    ).value = "";


    document.getElementById(
        "noteEleve"
    ).value = "";


    afficherNotesSauvegardees();

    mettreAJourStatistiques();
}


function afficherNotesSauvegardees() {

    let notes =
        JSON.parse(
            localStorage.getItem(
                "notes"
            )
        ) || [];


    let liste =
        document.getElementById(
            "listeNotes"
        );


    if (!liste) return;


    liste.innerHTML = "";


    notes.forEach(
        function(
            note,
            index
        ) {

            let li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <span>
                    📝
                    ${note.eleve} :
                    <strong>
                        ${note.note}/20
                    </strong>
                </span>

                <button
                    class="btn-supprimer"
                    onclick="supprimerNote(${index})">
                    🗑️
                </button>

            `;


            liste.appendChild(li);

        }
    );
}


function supprimerNote(index) {

    let notes =
        JSON.parse(
            localStorage.getItem(
                "notes"
            )
        ) || [];


    if (
        confirm(
            "Supprimer cette note ?"
        )
    ) {

        notes.splice(
            index,
            1
        );


        localStorage.setItem(
            "notes",
            JSON.stringify(
                notes
            )
        );


        afficherNotesSauvegardees();

        mettreAJourStatistiques();
    }
}


// =====================================================
// STATISTIQUES
// =====================================================

async function mettreAJourStatistiques() {

    let eleves = [];


    try {

        const resultat =
            await getDocs(
                collection(db, "eleves")
            );


        eleves =
            resultat.docs;

    }

    catch (erreur) {

        console.error(
            "Erreur statistiques élèves :",
            erreur
        );
    }


    let enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    let classes =
        JSON.parse(
            localStorage.getItem(
                "classes"
            )
        ) || [];


    let matieres =
        JSON.parse(
            localStorage.getItem(
                "matieres"
            )
        ) || [];


    let notes =
        JSON.parse(
            localStorage.getItem(
                "notes"
            )
        ) || [];


    let nombreEleves =
        document.getElementById(
            "nombreEleves"
        );


    let nombreEnseignants =
        document.getElementById(
            "nombreEnseignants"
        );


    let nombreClasses =
        document.getElementById(
            "nombreClasses"
        );


    let nombreMatieres =
        document.getElementById(
            "nombreMatieres"
        );


    let nombreNotes =
        document.getElementById(
            "nombreNotes"
        );


    if (nombreEleves) {

        nombreEleves.textContent =
            eleves.length;
    }


    if (nombreEnseignants) {

        nombreEnseignants.textContent =
            enseignants.length;
    }


    if (nombreClasses) {

        nombreClasses.textContent =
            classes.length;
    }


    if (nombreMatieres) {

        nombreMatieres.textContent =
            matieres.length;
    }


    if (nombreNotes) {

        nombreNotes.textContent =
            notes.length;
    }
}


// =====================================================
// RENDRE LES FONCTIONS ACCESSIBLES AUX BOUTONS HTML
// =====================================================

window.cacherSections =
    cacherSections;

window.afficherAccueil =
    afficherAccueil;

window.afficherEleves =
    afficherEleves;

window.ajouterEleve =
    ajouterEleve;

window.supprimerEleve =
    supprimerEleve;

window.viderEleves =
    viderEleves;

window.afficherEnseignants =
    afficherEnseignants;

window.ajouterEnseignant =
    ajouterEnseignant;

window.supprimerEnseignant =
    supprimerEnseignant;

window.afficherClasses =
    afficherClasses;

window.ajouterClasse =
    ajouterClasse;

window.supprimerClasse =
    supprimerClasse;

window.afficherMatieres =
    afficherMatieres;

window.ajouterMatiere =
    ajouterMatiere;

window.supprimerMatiere =
    supprimerMatiere;

window.afficherNotes =
    afficherNotes;

window.ajouterNote =
    ajouterNote;

window.supprimerNote =
    supprimerNote;
