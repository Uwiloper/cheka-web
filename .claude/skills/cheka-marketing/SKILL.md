---
name: cheka-marketing
description: Marketing y captación de Cheka para negocios peruanos (Gamarra, mercados, bodegas). Úsala para escribir publicaciones para grupos de Facebook o WhatsApp, guiones de video, mensajes de captación de testers, textos de la landing o de la ficha de Play, y para decidir en qué etapa estamos y qué medir.
---

# Cheka: marketing en una página

## Qué es Cheka, en palabras del cliente
"Cada Yape, Plin o transferencia que te llega aparece en tu caja al instante, con voz, y tu cajero no puede engañarte con capturas falsas."

El dolor que resolvemos, en orden de fuerza:
1. **Yapes falsos o capturas editadas**: el cajero o el cliente enseña un pantallazo y el dinero nunca llegó. Cheka confirma con el aviso real del banco.
2. **El dueño no puede estar en la tienda**: ve los cobros desde otro sitio, y el cajero entra con un PIN que vence.
3. **Cuadrar caja a fin de día**: digital y efectivo juntos, exportados a Excel.

## Lo que hace hoy (se puede prometer)
- Lee avisos de Yape, Plin, BCP, BBVA, Interbank, Scotiabank, Sip y Efectiva en un Android del dueño.
- Voz que anuncia el pago ("Juan Pérez te yapeó"), sin decir el monto.
- Terminal de cajero en cualquier navegador, con PIN tipo placa (ABC-123) que vence; el cajero no ve totales.
- Efectivo anotado por el dueño o el cajero, que el dueño confirma.
- Analíticas, Contabilidad y exportación a Excel.

## Lo que NO se puede prometer todavía
- No está en Play Store: se instala por APK. Decirlo sin rodeos y explicar por qué es seguro.
- No funciona en iPhone para leer pagos (solo el panel web).
- Formato SUNAT: no existe aún (ver d-21).
- No hay planes pagos activos: hoy todo es gratis para testers. No inventar precios ni descuentos.
- El dominio propio llega a fin de 2026; mientras tanto el enlace es de workers.dev.
- Nunca decir "100 % seguro", "certificado" ni nombrar a Yape o BCP como socios: no lo son.

## La barrera principal: confianza
Pedimos instalar un APK y dar acceso a las notificaciones. Toda pieza debe responder antes de que lo pregunten:
- Cheka **no pide claves** del banco ni de Yape, ni puede mover dinero.
- Solo lee el aviso que ya aparece en tu pantalla.
- Puedes pausarlo o desinstalarlo cuando quieras; tus datos son tuyos.
- Hay una persona real que responde por WhatsApp.

Muestra la cara y el nombre del creador: en Gamarra se confía en personas, no en marcas nuevas.

## Enlaces para las piezas
- **Página para compartir:** `/novedades`, con barra de secciones (#como, #seguridad, #probar, #instalar, #versiones): portada con escena animada de pagos de ejemplo, para quién es, 3 pasos, seguridad detallada (lo que ve / lo que nunca toca, protecciones y preguntas), "Lo hacemos contigo", formulario y novedades. Para llevar directo a una parte: `/novedades#seguridad` o `/novedades#probar`. Las escenas son ilustraciones: si llegan fotos reales de negocios (con permiso), van en las tarjetas de "Para quién es".
- **Llamado a la acción principal:** el formulario "Sé de los primeros 12 negocios" de `/novedades` (llega a `/admin` y por correo). En las publicaciones: "Déjanos tus datos en [enlace]/novedades" o "escríbeme CHEKA".
- **Visor:** ya no se ofrece en la página pública (pide nombres y montos de los avisos y asusta a quien llega por un grupo). Se manda por chat solo a testers elegidos, explicando para qué sirve.
- **WhatsApp de soporte:** sale de `src/data/soporte.json`. Hoy es el número personal del creador; al tener el prepago se cambia solo ahí.

## Público y canales
- **Primero**: negocios con cajero o ayudante y muchos Yapes al día — puestos de Gamarra, mercados (Caquetá, Unicachi, Mesa Redonda), bodegas, pollerías, cevicherías, ferreterías.
- **Grupos de Facebook de compra y venta** y comunidades de WhatsApp: leer las reglas del grupo; muchos prohíben publicidad. Mejor aportar (contar un caso de yape falso) y ofrecer ayuda que pegar un anuncio.
- **En persona**: una tarde en Gamarra con el teléfono mostrando la voz al llegar un Yape vale más que 50 publicaciones. Llevar un QR a /registro.
- No publicar el mismo texto en muchos grupos el mismo día: Facebook lo marca como spam.

## Voz y estilo
- Español peruano y cotidiano: "yapear", "cuadrar caja", "tu cajero", "al toque". Sin anglicismos (nada de "fintech", "dashboard", "onboarding").
- Frases cortas. Un beneficio por pieza. Termina con una sola acción ("Escríbeme 'CHEKA' por WhatsApp").
- Ejemplos y capturas **siempre con datos de ejemplo**, nunca de un usuario real (nombres, montos, DNI, teléfonos).

## Etapa y qué medir
Cheka está entre **MVP y primeros clientes**: el producto funciona, hay testers, nadie paga.
La meta de esta etapa no es "muchos usuarios", es **12 negocios que lo usen 5 de cada 7 días durante 2 semanas**. Coincide con la prueba cerrada de Play (t7-11), así que cada tester sirve doble.

Embudo, visible en `/admin`: registrados → teléfono lector activo → usan el panel varios días → abren turnos de cajero.
Para cada negocio que abandona, preguntar por qué (en persona o WhatsApp) y anotarlo en el plan como tarea r-NN.

## Plantillas
**Grupo de compra y venta (aporte, no anuncio):**
> ¿A alguien le han pasado un yape falso? A un amigo de Gamarra le enseñaron una captura editada y perdió S/ 180. Hice una app gratis que te avisa con voz cuando el Yape LLEGA de verdad, y tu cajero no puede fingirlo. Busco 12 negocios que la prueben 2 semanas, la instalo contigo. No pide claves del banco. Escríbeme "CHEKA" al WhatsApp.

**Mensaje directo tras el interés:**
> ¡Hola! Soy [nombre], hice Cheka. Te explico en 2 minutos: instalas la app en el celular donde te llegan los Yapes, y cada pago suena y aparece en tu panel. Tu cajero entra con un código que vence. No pide claves ni toca tu dinero. ¿Te la instalo por videollamada o paso por tu puesto?

**Guion de video (20–30 s, vertical):** llega un Yape → suena la voz → la terminal del cajero muestra el check verde → texto final "Sin capturas falsas. Gratis para los primeros 12 negocios."

## Antes de entregar una pieza
- ¿Promete solo lo de la lista "hace hoy"?
- ¿Responde la duda de confianza?
- ¿Tiene una sola acción clara?
- ¿Los datos de las capturas son de ejemplo?
