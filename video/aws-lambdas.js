/**
 * AWS Lambda Helpers
 *
 * Ahora (fase local): llama a los handlers directamente en proceso.
 * Después (fase AWS):  reemplazar por fetch() a Lambda Function URLs.
 *
 * Para migrar a AWS solo hay que cambiar estas dos funciones:
 *
 *   callLtxLambda(event)      → fetch(LTX_LAMBDA_URL, { body: JSON.stringify(event) })
 *   callRemotionLambda(event) → fetch(REMOTION_LAMBDA_URL, { body: JSON.stringify(event) })
 */

const ltxHandler      = require('./lambda-ltx2.cjs');
const remotionHandler = require('./lambda-render.cjs');

/**
 * Llama a Lambda 1 — LTX-2
 * Input:  { jobId, userId, imageUrl, prompt }
 * Output: { jobId, userId, imageUrlS3, ltxVideoUrl }
 */
async function callLtxLambda(event) {
  // --- FASE LOCAL ---
  return await ltxHandler.handler(event);

  // --- FASE AWS (descomentar cuando estén desplegadas las Function URLs) ---
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
  // --- FASE LOCAL ---
  return await remotionHandler.handler(event);

  // --- FASE AWS (descomentar cuando estén desplegadas las Function URLs) ---
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
