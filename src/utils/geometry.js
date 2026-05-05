/**
 * UTILITY GEOMETRICHE PER IL METODO DI MONGE
 * =============================================
 * 
 * Questo modulo contiene le formule matematiche per le proiezioni ortogonali
 * secondo il metodo di Monge in Geometria Descrittiva.
 * 
 * Il metodo di Monge utilizza tre piani di proiezione mutuamente perpendicolari:
 * - PO (Piano Orizzontale): piano XY a z = 0
 * - PV (Piano Verticale): piano XZ a y = 0
 * - PL (Piano Laterale): piano YZ a x = 0
 * 
 * Le proiezioni di un punto P(x, y, z) sono:
 * - P' (proiezione su PO): (x, y, 0)
 * - P'' (proiezione su PV): (x, 0, z)
 * - P''' (proiezione su PL): (0, y, z)
 */

/**
 * Calcola le proiezioni di un punto secondo il metodo di Monge
 * 
 * @param {number} x - Coordinata X del punto nello spazio
 * @param {number} y - Coordinata Y del punto nello spazio
 * @param {number} z - Coordinata Z del punto nello spazio
 * @returns {Object} Oggetto con le proiezioni sui tre piani
 *   - po: {x, y} - Proiezione sul Piano Orizzontale
 *   - pv: {x, z} - Proiezione sul Piano Verticale
 *   - pl: {y, z} - Proiezione sul Piano Laterale
 * 
 * Formula generale di proiezione ortogonale su un piano:
 * La proiezione di un punto P su un piano è il punto P' tale che
 * il vettore PP' è perpendicolare al piano.
 */
export function projectPointOnMonge(x, y, z) {
  return {
    // Proiezione sul Piano Orizzontale (PO)
    // Eliminando la coordinata z (proiezione ortogonale su XY)
    po: {
      x: x,
      y: y
    },
    
    // Proiezione sul Piano Verticale (PV)
    // Eliminando la coordinata y (proiezione ortogonale su XZ)
    pv: {
      x: x,
      z: z
    },
    
    // Proiezione sul Piano Laterale (PL)
    // Eliminando la coordinata x (proiezione ortogonale su YZ)
    pl: {
      y: y,
      z: z
    }
  };
}

/**
 * Calcola la distanza 3D tra due punti nello spazio
 * 
 * Formula: d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]
 * 
 * @param {Object} p1 - Primo punto {x, y, z}
 * @param {Object} p2 - Secondo punto {x, y, z}
 * @returns {number} Distanza tra i due punti
 */
export function distance3D(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calcola la distanza 2D tra due punti su un piano di proiezione
 * 
 * Formula: d = √[(x₂-x₁)² + (y₂-y₁)²]
 * 
 * @param {Object} p1 - Primo punto {x, y}
 * @param {Object} p2 - Secondo punto {x, y}
 * @returns {number} Distanza tra i due punti
 */
export function distance2D(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcola il ribaltamento di un punto dal Piano Verticale (PV)
 * verso il foglio di disegno (metodo di Monge classico)
 * 
 * Nel metodo di Monge, il PV viene ribaltato attorno alla Linea di Terra (LT).
 * 
 * @param {Object} pvPoint - Punto proiettato su PV {x, z}
 * @param {number} ltY - Posizione della Linea di Terra (asse Y)
 * @returns {Object} Punto ribaltato nel foglio 2D
 */
export function flipPVAroundLT(pvPoint, ltY = 0) {
  return {
    x: pvPoint.x,
    y: ltY - pvPoint.z // Ribaltamento attorno a LT
  };
}

/**
 * Calcola il ribaltamento di un punto dal Piano Laterale (PL)
 * verso il foglio di disegno
 * 
 * @param {Object} plPoint - Punto proiettato su PL {y, z}
 * @param {number} ltX - Posizione della Linea di Terra sull'asse X
 * @returns {Object} Punto ribaltato nel foglio 2D
 */
export function flipPLAroundLT(plPoint, ltX = 0) {
  return {
    x: ltX + plPoint.y,
    y: plPoint.z
  };
}

/**
 * Verifica se un punto appartiene a un piano di proiezione
 * 
 * @param {Object} point - Punto {x, y, z}
 * @param {string} plane - Piano: 'PO', 'PV', 'PL'
 * @returns {boolean} true se il punto appartiene al piano
 */
export function pointOnPlane(point, plane) {
  const tolerance = 0.001; // Tolleranza numerica
  
  switch (plane) {
    case 'PO': // Piano Orizzontale (z = 0)
      return Math.abs(point.z) < tolerance;
    case 'PV': // Piano Verticale (y = 0)
      return Math.abs(point.y) < tolerance;
    case 'PL': // Piano Laterale (x = 0)
      return Math.abs(point.x) < tolerance;
    default:
      return false;
  }
}

/**
 * Calcola l'angolo tra due vettori 3D in radianti
 * 
 * Formula: cos(θ) = (v₁ · v₂) / (|v₁| × |v₂|)
 * 
 * @param {Object} v1 - Primo vettore {x, y, z}
 * @param {Object} v2 - Secondo vettore {x, y, z}
 * @returns {number} Angolo in radianti (0 a π)
 */
export function angleBetweenVectors(v1, v2) {
  const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const magnitude1 = Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2);
  const magnitude2 = Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2);
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  const cosAngle = dotProduct / (magnitude1 * magnitude2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle))); // Clamp to [-1, 1]
}

/**
 * Calcola il prodotto vettoriale tra due vettori 3D
 * 
 * Formula: v₁ × v₂ = (y₁z₂ - z₁y₂, z₁x₂ - x₁z₂, x₁y₂ - y₁x₂)
 * 
 * @param {Object} v1 - Primo vettore {x, y, z}
 * @param {Object} v2 - Secondo vettore {x, y, z}
 * @returns {Object} Vettore risultante dal prodotto vettoriale
 */
export function crossProduct(v1, v2) {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };
}

/**
 * Calcola il prodotto scalare tra due vettori 3D
 * 
 * Formula: v₁ · v₂ = x₁x₂ + y₁y₂ + z₁z₂
 * 
 * @param {Object} v1 - Primo vettore {x, y, z}
 * @param {Object} v2 - Secondo vettore {x, y, z}
 * @returns {number} Prodotto scalare
 */
export function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Normalizza un vettore (lo rende di lunghezza 1)
 * 
 * @param {Object} v - Vettore {x, y, z}
 * @returns {Object} Vettore normalizzato
 */
export function normalizeVector(v) {
  const magnitude = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  if (magnitude === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / magnitude,
    y: v.y / magnitude,
    z: v.z / magnitude
  };
}

/**
 * Calcola la lunghezza di un vettore (magnitudine)
 * 
 * Formula: |v| = √(x² + y² + z²)
 * 
 * @param {Object} v - Vettore {x, y, z}
 * @returns {number} Lunghezza del vettore
 */
export function vectorMagnitude(v) {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}
