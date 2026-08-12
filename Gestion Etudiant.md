import tkinter as tk
from tkinter import messagebox

fenetre = tk.Tk()

def ajouter_etudiant(event=None):
    etudiant=champ_saisi.get().strip()
    if etudiant =="": 
        messagebox.showwarning("Attention", "saisisez un nom")
        return 
    liste_etudiant.insert(tk.END, etudiant) 
    champ_saisi.delete(0, tk.END) 
    
def supprimer_etudiant(): 
    selection=liste_etudiant.curselection()
    if not selection:
        messagebox.showwarning("Attention", "selectionne un nom")
        return 
    liste_etudiant.delete(selection[0]) 


def modifier_etudiant():
    selection = liste_etudiant.curselection()
    if not selection:
        messagebox.showwarning("Attention", "Sélectionnez un nom à modifier")
        return
    
    nouveau_nom = champ_saisi.get().strip()
    if nouveau_nom == "":
        messagebox.showwarning("Attention", "Saisissez le nouveau nom dans le champ de texte")
        return
    
    index = selection[0]
    liste_etudiant.delete(index)
    liste_etudiant.insert(index, nouveau_nom)
    champ_saisi.delete(0, tk.END)


def vider_etudiant():
    if liste_etudiant.size() ==0: 
        messagebox.showinfo("Information", "la liste est déjà vide")
        return
    reponse=messagebox.askyesno ("confirmation", 
                           "veilez-vous vraiment vider la liste?")
    if reponse:
        liste_etudiant.delete(0, tk.END)

fenetre.geometry("500x450") # Légère augmentation de la hauteur pour les boutons
fenetre.resizable(False,False)
fenetre.title("Gestion d'Etudiant")

titre=tk.Label(fenetre, text="Mini projet TD1",
               font=("Arial",18,"bold"))
titre.pack(pady=10)

cadre_de_saisi=tk.Frame(fenetre)
cadre_de_saisi.pack(pady=5)

champ_saisi=tk.Entry(cadre_de_saisi,
                     width=35, font=("Arial", 12))
champ_saisi.grid(row=0, column=0, padx=5)
champ_saisi.bind("<Return>", ajouter_etudiant)

bouton_ajouter=tk.Button(cadre_de_saisi,
                         text="ajouter",
                         width=12, command=ajouter_etudiant)
bouton_ajouter.grid(row=0, column=1, padx=5)

liste_etudiant=tk.Listbox(fenetre, width=50, height=10,
                           font=("Arial", 12, "bold"))
liste_etudiant.pack(pady=10)

cadre_actions=tk.Frame(fenetre)
cadre_actions.pack(pady=10)

bouton_supprimer=tk.Button(cadre_actions, text="Supprimer",
                           width=15, command= supprimer_etudiant)
bouton_supprimer.grid(row=0, column=0, padx=5)

bouton_modifier = tk.Button(cadre_actions, text="Modifier",
                            width=15, command=modifier_etudiant)
bouton_modifier.grid(row=0, column=1, padx=5)


bouton_vider=tk.Button(cadre_actions, text="Vider la liste", 
                       width=15, command= vider_etudiant)
bouton_vider.grid(row=0, column=2, padx=5)

champ_saisi.bind("<Return>", ajouter_etudiant)

fenetre.mainloop()