/**
 * AWS Lambda Helpers
 *
 * FASE ACTUAL (local): llama a los handlers directamente en proceso.
 *
 * FASE AWS (después, cuando se desplieguen las Lambda Function URLs):
 *   Cambiar callLtxLambda    → fetch(LTX_LAMBDA_URL,     { method:'POST', body: JSON.stringify(event) })
 *   Cambiar callRemotionLambda → fetch(REMOTION_LAMBDA_URL, { method:'POST', body: JSON.stringify(event) })
 *
 * Solo hay que cambiar estas dos funciones. El resto del código (server.cjs,
 * ContentStudio.jsx) no cambia en absoluto.
 */

const ltxHandler      = require('./lambda-ltx2.cjs');
const remotionHandler = require('./lambda-render.cjs');

/**
 * Llama a Lambda 1 — LTX-2
 * Input:  { jobId, userId, imageUrl, prompt }
 * Output: { jobId, userId, imageUrlS3, ltxVideoUrl }
 */
async function callLtxLambda(event) {
  // --- FASE LOCAL: handler en proceso ---
  return await ltxHandler.handler(event);

  // --- FASE AWS (descomentar cuando Lambda Function URL esté desplegada) ---
  // const LTX_LAMBDA_URL = process.env.LTX_LAMBDA_URL;
  // if (!LTX_LAMBDA_URL) throw new Error('LTX_LAMBDA_URL not set');
  // const res = await fetch(LTX_LAMBDA_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event)
  // });
  // if (!res.ok) throw new Error(`LTX Lambda error: ${res.status} ${await res.text()}`);
  // return res.json();
}

/**
 * Llama a Lambda 2 — Remotion Render
 * Input:  { jobId, userId, ltxVideoUrl, imageUrl, title, subtitle, musicFile }
 * Output: { jobId, userId, finalVideoUrl, renderId, renderTime }
 */
async function callRemotionLambda(event) {
  // --- FASE LOCAL: handler en proceso ---
  return await remotionHandler.handler(event);

  // --- FASE AWS (descomentar cuando Lambda Function URL esté desplegada) ---
  // const REMOTION_LAMBDA_URL = process.env.REMOTION_LAMBDA_URL;
  // if (!REMOTION_LAMBDA_URL) throw new Error('REMOTION_LAMBDA_URL not set');
  // const res = await fetch(REMOTION_LAMBDA_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event)
  // });
  // if (!res.ok) throw new Error(`Remotion Lambda error: ${res.status} ${await res.text()}`);
  // return res.json();
}

module.exports = { callLtxLambda, callRemotionLambda };
