///doGet para verifcar el webhook con el token
function doGet(e) {
	try {
		var mytoken = "Poner_Token_creado"; /////unico cambo
		var token = e.parameter["hub.verify_token"];
		var challenge = e.parameter["hub.challenge"];
		if (challenge != null && token != null && token === mytoken) {
			return ContentService.createTextOutput(challenge);
		} else {
			return ContentService.createTextOutput("400");
		}
	} catch (error) {
		return ContentService.createTextOutput("Hubo un error" + error)
			.setMimeType(ContentService.MimeType.TEXT)
			.setStatusCode(400);
	}
}
