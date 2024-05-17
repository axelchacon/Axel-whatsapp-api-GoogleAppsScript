/// se usa doPost para crear la estructura base de Webhook que permita recibir los eventos que Meta nos notificará como recivir los  mensajes que llegan desde Whatsapp
function doPost(e) {
	try {
		var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

		//Capturar contenido del Webhook recibido
		var operation = JSON.parse(e.postData.contents); /// total
		var messageData = operation.entry[0].changes[0].value.messages[0];

		//Extraer información del contenido  para la lógica de conversación.
		var recipientNumber = messageData.from; ///mi numero
		var messageType = messageData.type;
		var message_id = messageData.id;
		var message_body = messageData.text.body; ///Tipo text

		// Guardar el valor de la función buscarTexto para usarlo en la parte condicional de mensaje para Dalle
		var buscaDalle = buscarTexto(message_body, "imagen"); //Bota true o false

		// Insertar la información extraída del usuario que se va a enviar el mensaje en la hoja de cálculo
		sheet.getRange(3, 1).setValue(recipientNumber);
		sheet.getRange(3, 2).setValue(message_body);
		sheet.getRange(3, 3).setValue(messageType);
		sheet.getRange(3, 4).setValue(message_id);

		//Lógica condicional para manejar el tipo de mensaje que se va a enviar al usuario dependiento del mensaje del usuario
		if (message_body == "Hola template") {
			ScriptApp.newTrigger(sendTemplateMessage(recipientNumber))
				.timeBased()
				.after(10)
				.create();
		} else if (message_body == "Hola texto plano") {
			ScriptApp.newTrigger(
				sendMessage(
					recipientNumber,
					"Hola Amigo, sos un crack. Visita nuestra landing page: https://nuclea.solutions/",
					"text"
				)
			)
				.timeBased()
				.after(10)
				.create();
		} else if (message_body == "Hola GPT") {
			ScriptApp.newTrigger(
				sendMessage(recipientNumber, getMessageGPT(message_body), "text")
			)
				.timeBased()
				.after(10)
				.create();
		} else if (buscaDalle != null && buscaDalle == true) {
			ScriptApp.newTrigger(
				sendMessage(recipientNumber, getMessageDALLE(message_body), "image")
			)
				.timeBased()
				.after(10)
				.create();
		} else {
			ScriptApp.newTrigger(
				sendMessage(
					recipientNumber,
					"Hola Amigo,no te entiendo. Escribe 'Hola template', 'Hola texto plano', 'un texto que incluya (imagen)' o 'Hola GPT' para entenderte",
					"text"
				)
			)
				.timeBased()
				.after(10)
				.create();
		}

		//Regresar respuesta de status 200 a Meta
		return ContentService.createTextOutput("200")
			.setMimeType(ContentService.MimeType.TEXT)
			.setStatusCode(200);
	} catch (error) {
		////Se registra el error junto con los detalles del evento en una hoja de cálculo específica llamada "errores"
		var ss = SpreadsheetApp.getActiveSpreadsheet();
		var requestLog = ss.getSheetByName("errores");
		requestLog.appendRow([JSON.stringify(operation), "Evento recibido"]);

		//Se devuelve una respuesta al webhook con un código de estado HTTP 400 y un mensaje de error si ocurre un error durante el procesamiento del evento.
		return ContentService.createTextOutput("Hubo un error Evento" + error)
			.setMimeType(ContentService.MimeType.TEXT)
			.setStatusCode(400);
	}
}
