export const initialGuides = [
  {
    id: 'amara-rojas',
    name: 'Amara Rojas',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    story:
      'Después de acompañar procesos de duelo y transición por más de ocho años, descubrí que los círculos pueden devolvernos escucha, calma y pertenencia.',
    experience:
      'Facilitadora de bienestar emocional, terapeuta floral y diseñadora de experiencias grupales en Santiago y Valparaíso.',
    special:
      'Mis círculos combinan conversación guiada, escritura terapéutica y pequeños rituales cotidianos que aterrizan el aprendizaje en la vida real.',
    rating: 4.9,
    reviews: [
      {
        name: 'Camila',
        stars: 5,
        comment: 'Me sentí sostenida desde el primer minuto. El espacio fue cálido, respetuoso y muy bien guiado.',
      },
      {
        name: 'Isidora',
        stars: 5,
        comment: 'Salí con herramientas concretas y una sensación muy real de comunidad.',
      },
    ],
  },
  {
    id: 'sofia-lagos',
    name: 'Sofía Lagos',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
    story:
      'Mi camino comenzó en talleres creativos para mujeres migrantes. Allí confirmé que crear juntas puede ser profundamente reparador.',
    experience:
      'Arteterapeuta, gestora cultural y guía de procesos creativos con enfoque de autocuidado y expresión corporal.',
    special:
      'Propongo encuentros sensibles y contemporáneos donde el arte se vuelve una herramienta de autorreconocimiento, sin presión estética.',
    rating: 4.8,
    reviews: [
      {
        name: 'Fernanda',
        stars: 5,
        comment: 'Nunca pensé que un círculo creativo pudiera ayudarme tanto a ordenar lo que estaba sintiendo.',
      },
      {
        name: 'Martina',
        stars: 4,
        comment: 'Muy amoroso, bien organizado y con una energía tranquila que da confianza.',
      },
    ],
  },
  {
    id: 'valentina-cerda',
    name: 'Valentina Cerda',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
    story:
      'He trabajado por años en comunidades de aprendizaje espiritual y prácticas de presencia. Circular nace como una forma de reunir ese recorrido en espacios seguros.',
    experience:
      'Mentora de mindfulness, facilitadora somática y anfitriona de retiros breves para mujeres que buscan reconectar consigo mismas.',
    special:
      'Mis círculos integran respiración, introspección guiada y conversación honesta desde una estética sobria, humana y cercana.',
    rating: 5,
    reviews: [
      {
        name: 'Josefa',
        stars: 5,
        comment: 'La combinación entre práctica corporal y conversación íntima fue perfecta.',
      },
      {
        name: 'Antonia',
        stars: 5,
        comment: 'Valentina transmite mucha presencia y profesionalismo. Volvería feliz.',
      },
    ],
  },
]

export const initialCircles = [
  {
    id: 'circulo-renacer',
    title: 'Renacer con suavidad',
    shortDescription:
      'Un encuentro para soltar el cansancio emocional y reconectar con tu energía personal.',
    intention:
      'Crear un espacio seguro de pausa y escucha para mujeres que están atravesando cambios, cierres o una necesidad profunda de volver a sí mismas.',
    theme: 'Sanación emocional',
    expectations:
      'Meditación suave, conversación guiada, journaling y una dinámica de cierre en comunidad.',
    duration: '2 horas',
    materials: 'Cuaderno, lápiz y una manta ligera.',
    price: 18000,
    priceLabel: '$18.000 CLP',
    priceType: 'paid',
    region: 'Metropolitana',
    comuna: 'Providencia',
    date: '2026-05-08',
    time: '19:00',
    guideId: 'amara-rojas',
    image:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    type: 'sanacion',
    locationDetails: 'Estudio Luz Serena, a pasos del metro Pedro de Valdivia.',
  },
  {
    id: 'circulo-florecer',
    title: 'Florecer creativo',
    shortDescription:
      'Círculo para despertar creatividad, juego interno y expresión auténtica.',
    intention:
      'Acompañar a mujeres que buscan abrir espacios de creación sin juicio, fortaleciendo su voz y su intuición.',
    theme: 'Creatividad',
    expectations:
      'Collage intuitivo, escritura libre, conversación en parejas y cierre colectivo.',
    duration: '2 horas y 30 minutos',
    materials: 'Ropa cómoda. Los materiales creativos están incluidos.',
    price: 22000,
    priceLabel: '$22.000 CLP',
    priceType: 'paid',
    region: 'Valparaíso',
    comuna: 'Viña del Mar',
    date: '2026-05-15',
    time: '18:30',
    guideId: 'sofia-lagos',
    image:
      'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80',
    type: 'creatividad',
    locationDetails: 'Casa taller La Ribera, sector poniente de Viña del Mar.',
  },
  {
    id: 'circulo-presencia',
    title: 'Presencia y raíz',
    shortDescription:
      'Una experiencia de respiración, quietud y conversación para volver al centro.',
    intention:
      'Ofrecer un espacio contemporáneo y amoroso para cultivar regulación, presencia y conexión interna.',
    theme: 'Espiritualidad',
    expectations:
      'Respiración guiada, práctica somática, té consciente y ronda de palabra.',
    duration: '1 hora y 45 minutos',
    materials: 'Botella de agua y ropa abrigada para el cierre.',
    price: 0,
    priceLabel: 'Gratuito',
    priceType: 'free',
    region: 'Biobío',
    comuna: 'Concepción',
    date: '2026-05-19',
    time: '20:00',
    guideId: 'valentina-cerda',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    type: 'espiritualidad',
    locationDetails: 'Espacio Tierra Clara, barrio universitario.',
  },
  {
    id: 'circulo-cuerpo',
    title: 'Cuerpo, voz y confianza',
    shortDescription:
      'Encuentro íntimo para habitar el cuerpo con más amabilidad y presencia.',
    intention:
      'Explorar recursos sencillos de conexión corporal y expresión emocional en un entorno cuidado.',
    theme: 'Bienestar',
    expectations:
      'Movimiento suave, respiración, conversación y práctica de límites sanos.',
    duration: '2 horas',
    materials: 'Calcetines, cuaderno y una botella de agua.',
    price: 16000,
    priceLabel: '$16.000 CLP',
    priceType: 'paid',
    region: 'Metropolitana',
    comuna: 'Ñuñoa',
    date: '2026-05-24',
    time: '11:00',
    guideId: 'valentina-cerda',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
    type: 'sanacion',
    locationDetails: 'Sala Magnolia, a 10 minutos del metro Chile España.',
  },
  {
    id: 'circulo-luna',
    title: 'Círculo de luna nueva',
    shortDescription:
      'Ritual íntimo y elegante para sembrar intención, claridad y visión compartida.',
    intention:
      'Invitar a cada participante a reconocer lo que desea cultivar en el próximo ciclo con apoyo colectivo.',
    theme: 'Espiritualidad',
    expectations:
      'Visualización, escritura de intención, altar floral simple y ronda de cierre.',
    duration: '2 horas',
    materials: 'Una flor, cuaderno y algo pequeño para tu altar personal.',
    price: 20000,
    priceLabel: '$20.000 CLP',
    priceType: 'paid',
    region: 'Los Lagos',
    comuna: 'Puerto Varas',
    date: '2026-05-28',
    time: '19:30',
    guideId: 'amara-rojas',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    type: 'espiritualidad',
    locationDetails: 'Casa Bosque Sur, con vista al lago y estacionamiento.',
  },
  {
    id: 'circulo-tejido',
    title: 'Tejido de historias',
    shortDescription:
      'Círculo para escuchar, compartir y resignificar historias personales desde la ternura.',
    intention:
      'Fortalecer el sentido de pertenencia a través de la escucha y la narración colectiva.',
    theme: 'Conexión humana',
    expectations:
      'Ronda guiada, ejercicio narrativo, pausa de té y cierre con intención colectiva.',
    duration: '2 horas',
    materials: 'Una foto o pequeño objeto con significado personal.',
    price: 12000,
    priceLabel: '$12.000 CLP',
    priceType: 'paid',
    region: 'Araucanía',
    comuna: 'Temuco',
    date: '2026-06-02',
    time: '18:00',
    guideId: 'sofia-lagos',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    type: 'conexion',
    locationDetails: 'Espacio Raíz, centro de Temuco.',
  },
]
