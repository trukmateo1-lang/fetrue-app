export const quotes: { text: string; author: string }[] = [
  { text: "La fe no es saber qué pasará, sino confiar en lo que estás haciendo con quien eres hoy.", author: "Reflexión Fetrue" },
  { text: "Crecer no es cambiar quien eres, es desenterrar quien siempre fuiste.", author: "Anónimo" },
  { text: "La verdad pesa al principio. Después, se vuelve la única cosa que sabes cargar sin cansarte.", author: "Reflexión Fetrue" },
  { text: "El silencio enseña más que mil consejos a quien sabe escucharse.", author: "Rumi (adaptado)" },
  { text: "Sé el tipo de persona que te hubiera salvado hace cinco años.", author: "Anónimo" },
  { text: "Lo auténtico no necesita explicación; lo falso no resiste el tiempo.", author: "Reflexión Fetrue" },
  { text: "Confiar es soltar el control, no abandonar la dirección.", author: "Reflexión Fetrue" },
  { text: "Tu paz interior vale más que cualquier discusión que puedas ganar.", author: "Anónimo" },
  { text: "El alma se cura igual que el cuerpo: con descanso, con verdad, y con tiempo.", author: "Reflexión Fetrue" },
  { text: "La gratitud convierte lo que tienes en suficiente.", author: "Melody Beattie" },
  { text: "No hay camino corto hacia los lugares que valen la pena.", author: "Beverly Sills (adaptado)" },
  { text: "Cuando dudes, vuelve a tu respiración. Ahí vive la respuesta.", author: "Reflexión Fetrue" },
  { text: "La fe no apaga el miedo, lo hace más pequeño que tú.", author: "Reflexión Fetrue" },
  { text: "Lo que repites cada día, te repite a ti.", author: "Anónimo" },
  { text: "Ser uno mismo en un mundo que te quiere distinto es la batalla más grande, y la más bella.", author: "E. E. Cummings (adaptado)" },
];

export const reflections: { title: string; text: string }[] = [
  { title: "Empezar otra vez", text: "Hoy no tienes que ser mejor que nadie. Solo un milímetro más consciente que ayer. Respira tres veces. Nombra una cosa por la que estés agradecido. Esa es la base. Sobre eso se construye todo lo demás." },
  { title: "El peso que no es tuyo", text: "Hay cargas que llevas por costumbre, no por necesidad. Pregúntate hoy: ¿esta preocupación es realmente mía, o la estoy cargando por otro? Suelta lo que no te corresponde. Tu energía es sagrada." },
  { title: "Confiar sin pruebas", text: "La fe empieza donde termina la certeza. No esperes a verlo todo claro para dar el siguiente paso. La claridad llega caminando, no esperando. Da un paso pequeño hoy hacia algo que sí importa." },
  { title: "La voz que te habla bien", text: "Escucha cómo te hablas. Si no le hablarías así a alguien que amas, no te lo digas a ti. Hoy, sustituye una crítica interna por una frase honesta y amable. Tu mente aprende lo que le enseñas a repetir." },
  { title: "Estar presente", text: "Pasamos la vida en dos lugares donde no existimos: el pasado y el futuro. El único sitio real es este momento. Mira a tu alrededor. Nombra cinco cosas que ves. Acabas de volver a casa." },
  { title: "Pequeñas verdades", text: "No tienes que cambiar tu vida entera hoy. Solo decir una verdad pequeña. A ti mismo, a alguien cercano. La autenticidad se construye en frases minúsculas que dejan de mentir." },
];

export const challenges: { title: string; description: string }[] = [
  { title: "Tres respiraciones conscientes", description: "Antes de mirar el teléfono mañana, haz tres respiraciones profundas con los ojos cerrados. Solo eso." },
  { title: "Una llamada que pospones", description: "Hay una persona en tu mente. Mándale un mensaje corto hoy. No tiene que ser perfecto." },
  { title: "30 minutos sin pantalla", description: "Elige media hora del día y déjalo todo en silencio. Camina, escribe, o simplemente mira por la ventana." },
  { title: "Agradece en voz alta", description: "Di tres cosas por las que estás agradecido. En voz alta. Aunque estés solo. El cuerpo te escucha." },
  { title: "Pide perdón a ti mismo", description: "Por algo que aún cargas. Escríbete una frase corta de perdón. Léetela dos veces." },
  { title: "Escucha sin responder", description: "Hoy, en una conversación, escucha completo antes de pensar tu respuesta. Solo presencia." },
  { title: "Una verdad pequeña", description: "Di algo verdadero hoy que normalmente callarías por cortesía. Con respeto, pero con verdad." },
];

// Deterministic by day-of-year so todo el mundo ve lo mismo el mismo día,
// pero pueden mezclar para ver más contenido.
export function pickByDay<T>(arr: T[], offset = 0): T {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((+now - +start) / 86400000);
  return arr[(day + offset) % arr.length];
}
