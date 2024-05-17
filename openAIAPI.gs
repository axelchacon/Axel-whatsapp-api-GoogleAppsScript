//const Mytok = "Poner_token_generado";
const OPENAI_API_URL_GPT = "https://api.openai.com/v1/chat/completions";
//Función de llamada a GPT que permitirá que nos bote un mensaje creado por GPT en formato texto o string
function getMessageGPT(textUsuario) {
	try {
		var system_prompt =
			"You are an assistant specialized in answering users or clients based on a text that belongs to the user or client, your duty is to answer and respond to those users or clients kindly and respectfully and give your result in text format, for example, if  User says 'Hello', the GPT assistant could says ('I am fine, I hope you are having a good time'\n\n). The output should always and only be delivered in a text format ready to use in the code, without anything else. No array, array, JSON formatting or additional formatting is required in the output, just the text.";

		var messages = [
			{ role: "system", content: system_prompt },
			{ role: "user", content: JSON.stringify(textUsuario) },
		];

		var headers = {
			"Content-Type": "application/json",
			Authorization: "Bearer " + Mytok,
		};

		var payload = {
			model: "gpt-3.5-turbo",
			messages: messages,
			temperature: 0.1,
			max_tokens: 800,
		};

		var options = {
			method: "post",
			headers: headers,
			payload: JSON.stringify(payload),
		};

		var response = UrlFetchApp.fetch(OPENAI_API_URL_GPT, options);
		var result = JSON.parse(response.getContentText());
		var generatedText = result.choices[0].message.content;
		return generatedText; //Formato texto respuesta GPT como "cómo te encuentras etimado? En qué puedo ayudarte ?"
	} catch (error) {
		return ContentService.createTextOutput(
			"Error en la función getGPTresponse:" + error
		);
	}
}

//Función de llamada a Dalle que permitirá que nos bote un mensaje creado por Dalle en formato link

const OPENAI_API_URL_DALLE = "https://api.openai.com/v1/images/generations";
function getMessageDALLE(prompt) {
	try {
		var headers = {
			"Content-Type": "application/json",
			Authorization: "Bearer " + Mytok,
		};

		var payload = {
			model: "dall-e-3",
			prompt: prompt,
			size: "1024x1024",
			response_format: "url",
			n: 1,
		};

		var options = {
			method: "POST",
			headers: headers,
			payload: JSON.stringify(payload),
		};
		var response = UrlFetchApp.fetch(OPENAI_API_URL_DALLE, options);
		var result = JSON.parse(response.getContentText());
		var image_URL = result.data[0].url;
		return image_URL;
	} catch (error) {
		return ContentService.createTextOutput(
			"Error en la función getMessageDALLE:" + error
		);
	}
}

///función que srive verificar si se encuenta el primer teto pedido dentro de la oración o cadena de texto y bota un true o false en caso no encuentre
function buscarTexto(cadena, texto) {
	return cadena.indexOf(texto) !== -1;
}
