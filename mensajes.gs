// Función para enviar solo mensajes tipo template
function sendTemplateMessage(recipientNumber) {
	var payload = {
		messaging_product: "whatsapp",
		to: recipientNumber,
		type: "template",
		template: {
			name: "text_simple", /// cambiar egún el nombre del template creado por ti
			language: {
				code: "es_MX", //language
			},
			components: [
				{
					type: "body",
					parameters: [],
				},
			],
		},
	};
	var options = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer Token_API_Whatsapp",
		},
		method: "POST",
		payload: JSON.stringify(payload),
	};
	var response = UrlFetchApp.fetch(
		"https://graph.facebook.com/v18.0/265558593313066/messages",
		options
	);

	var sheetss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	sheetss
		.getRange(3, 5)
		.setValue(
			"1. Tipo de mensaje: " +
				payload.type +
				" , " +
				"2. Nombre del template: " +
				payload.template.name +
				", " +
				"3. Body del template: 'En qué puedo ayudarte ? Somos los mejores en ayudarte a digitalizarte'"
		);
	return response;
}

// Función para enviar solo mensajes tipo texto (teto plano o creado por GPT) e imágenes tipo foto (creado por Dalle)
function sendMessage(phone_number, message, messageType) {
	try {
		var payload = {
			messaging_product: "whatsapp",
			to: phone_number,
			type: messageType,
		};

		// Añadir contenido según el tipo de mensaje
		if (messageType === "text") {
			payload.text = { preview_url: true, body: message };
			if (message && message != null) {
				var sheetss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
				sheetss.getRange(3, 5).setValue(message);
			}
		} else if (messageType === "image") {
			payload.image = { link: message };
			if (message && message != null) {
				var sheetss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
				sheetss.getRange(3, 5).setValue(message);
			}
		}
		var options = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer Token_API_Whatsapp",
			},
			method: "POST",
			payload: JSON.stringify(payload),
		};
		var response = UrlFetchApp.fetch(
			"https://graph.facebook.com/v18.0/265558593313066/messages",
			options
		);
		/// https://graph.facebook.com/v18.0/265558593313066/messages
		return response;
	} catch (error) {
		return ContentService.createTextOutput(
			"Error en la función sendMessage:" + error
		);
	}
}
