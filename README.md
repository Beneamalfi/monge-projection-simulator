# Monge Projection Simulator

🎓 **Simulatore Interattivo delle Proiezioni Ortogonali - Metodo di Monge**

Un'applicazione web moderna per l'insegnamento della Geometria Descrittiva, che permette di visualizzare in tempo reale come i punti nello spazio 3D vengono proiettati sui tre piani di Monge.

## 📋 Caratteristiche Principali

✨ **Visualizzazione 3D Interattiva**
- Visualizzazione completa dello spazio 3D con i tre piani di proiezione
- Assi coordinati X, Y, Z
- Linea di Terra (LT) - intersezione tra Piano Orizzontale e Verticale
- Rotazione interattiva della vista con mouse
- Zoom con rotellina del mouse

📐 **Metodo di Monge 2D**
- Rappresentazione bidimensionale delle proiezioni ortogonali
- Proiezioni su tre piani: PO (Orizzontale), PV (Verticale), PL (Laterale)
- Linee di rinvio (costruzione) per visualizzare i collegamenti
- Etichette coordinate per ogni proiezione

🎯 **Inserimento Interattivo**
- Form semplice per inserire coordinate (X, Y, Z)
- Aggiunta e rimozione di punti in tempo reale
- Lista dei punti inseriti con coordinate visualizzate

## 🚀 Come Iniziare

### Prerequisiti
- Node.js (v14 o superiore)
- npm o yarn

### Installazione

```bash
# Clona il repository
git clone https://github.com/Beneamalfi/monge-projection-simulator.git
cd monge-projection-simulator

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start
```

L'applicazione si aprirà automaticamente a `http://localhost:3000`

## 📦 Stack Tecnologico

- **React 18** - Framework JavaScript per l'interfaccia utente
- **Three.js** - Libreria 3D per il rendering WebGL
- **CSS3** - Styling responsive e moderno

## 📂 Struttura del Progetto

```
monge-projection-simulator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ControlPanel.js       # Pannello di controllo
│   │   ├── Viewer3D.js           # Visualizzatore 3D con Three.js
│   │   └── MongePanel.js         # Pannello proiezioni 2D
│   ├── utils/
│   │   └── geometry.js           # Funzioni geometriche e matematiche
│   ├── App.js                    # Componente principale
│   ├── App.css                   # Stili dell'applicazione
│   ├── index.js                  # Punto di ingresso
│   └── index.css                 # Stili globali
├── package.json
├── .gitignore
└── README.md
```

## 📚 Come Usare l'Applicazione

1. **Inserisci le Coordinate**
   - Digita i valori X, Y, Z nel pannello sinistro
   - Clicca "Aggiungi Punto" per visualizzare il punto nello spazio

2. **Osserva la Visualizzazione 3D**
   - Vedi il punto nello spazio 3D nella parte destra
   - Trascina il mouse per ruotare la vista
   - Usa la rotellina per ingrandire/rimpicciolire

3. **Comprendi le Proiezioni**
   - Nel pannello inferiore vedi le proiezioni di Monge
   - Osserva come il punto viene proiettato sui tre piani
   - Utilizza le linee di rinvio per comprendere i collegamenti

## 🎓 Concetti di Geometria Descrittiva

### Metodo di Monge
Il metodo di Monge utilizza tre piani di proiezione mutuamente perpendicolari:

- **Piano Orizzontale (PO)**: Piano XY, parallelo al terreno
- **Piano Verticale (PV)**: Piano XZ, verticale verso l'osservatore
- **Piano Laterale (PL)**: Piano YZ, verticale verso destra

### Proiezioni
- **P'**: Proiezione ortogonale di P sul Piano Orizzontale
- **P''**: Proiezione ortogonale di P sul Piano Verticale
- **P'''**: Proiezione ortogonale di P sul Piano Laterale

### Linea di Terra (LT)
Rappresenta l'intersezione tra il Piano Orizzontale e il Piano Verticale.

## 💡 Esempi di Utilizzo

### Punto nel Primo Quadrante
- X = 5, Y = 5, Z = 5
- Osserva come il punto si proietta su tutti e tre i piani

### Punto sul Piano Orizzontale
- X = 3, Y = 4, Z = 0
- La proiezione su PV e PL giace sulla Linea di Terra

### Punto sull'Asse Z
- X = 0, Y = 0, Z = 8
- Tutte le proiezioni si incontrano su un punto della LT

## 🔧 Comandi Utili

```bash
# Avvia l'app in modalità sviluppo
npm start

# Build per la produzione
npm run build

# Esegui i test
npm test

# Eject (attenzione: irreversibile)
npm run eject
```

## 📐 Funzioni Geometriche Disponibili

Il modulo `geometry.js` include:

- `projectPointOnMonge(x, y, z)` - Calcola le proiezioni ortogonali
- `distance3D(p1, p2)` - Distanza tra due punti nello spazio
- `distance2D(p1, p2)` - Distanza tra due punti su un piano
- `angleBetweenVectors(v1, v2)` - Angolo tra due vettori
- `crossProduct(v1, v2)` - Prodotto vettoriale
- `dotProduct(v1, v2)` - Prodotto scalare
- `normalizeVector(v)` - Normalizzazione vettoriale

## 🌐 Browser Supportati

- Chrome (consigliato)
- Firefox
- Safari
- Edge

## 📝 Licenza

Questo progetto è distribuito sotto licenza MIT.

## 👤 Autore

**Beneamalfi**

## 🤝 Contributi

I contributi sono benvenuti! Per contribuire:

1. Fork il repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit i cambiamenti (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📞 Supporto

Per domande o segnalazioni di bug, apri un'issue nel repository.

---

**Creato come strumento educativo per l'insegnamento della Geometria Descrittiva** 🎓✨
