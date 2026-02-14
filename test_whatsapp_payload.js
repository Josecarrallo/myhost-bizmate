// Simulación de lo que recibirá n8n
const webhookPayload = {
  body: {
    communicationId: "9f20534d-2c6d-4c75-8d33-d6f1db747972",
    tenantId: "c24393db-d318-4d75-8bbf-0fa240b9c1db",
    propertyId: null,
    guestId: "98171a38-179e-421c-9568-a2b4a61f03fa",
    bookingId: null,
    channel: "whatsapp",
    templateKey: "welcome",
    subject: null,
    message: "Dear José Carrallo,\n\nWelcome to Your Property! We're thrilled to have you stay with us.\n\nIf you have any questions before your arrival, please don't hesitate to reach out.\n\nBest regards,\nYour Property Team",
    recipient: "+34619794604"
  }
};

// Template del jsonBody del workflow
const jsonBodyTemplate = `={
  "messaging_product": "whatsapp",
  "to": "{{$json.body.recipient}}",
  "type": "text",
  "text": {
    "body": "{{$json.body.message}}"
  }
}`;

// Simular evaluación de variables
const $json = webhookPayload;

const resolvedJson = {
  "messaging_product": "whatsapp",
  "to": $json.body.recipient,
  "type": "text",
  "text": {
    "body": $json.body.message
  }
};

console.log("✅ WEBHOOK PAYLOAD:");
console.log(JSON.stringify($json, null, 2));

console.log("\n✅ JSON QUE SE ENVIARÁ A CHAKRA:");
console.log(JSON.stringify(resolvedJson, null, 2));

console.log("\n✅ VALIDACIÓN:");
console.log("- messaging_product:", resolvedJson.messaging_product);
console.log("- to:", resolvedJson.to);
console.log("- type:", resolvedJson.type);
console.log("- body:", resolvedJson.text.body.substring(0, 50) + "...");

// Validar que es JSON válido
try {
  JSON.stringify(resolvedJson);
  console.log("\n✅ JSON ES VÁLIDO");
} catch (e) {
  console.log("\n❌ ERROR:", e.message);
}
