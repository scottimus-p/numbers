
function validateHexadecimalInput() {
	if (!isValidHexadecimalForByteLength(hexadecimalInput.value, numBytes)) {
		hexadecimalInput.value = hexadecimalInput.value.substring(0, hexadecimalInput.value.length - 1)
	}
}

function validateBinaryInput() {
	if (!isValidBinaryForByteLength(binaryInput.value, numBytes)) {
		binaryInput.value = binaryInput.value.substring(0, binaryInput.value.length - 1)
		// maybe do a message next to the input box
	}
}

function validateDecimalInput() {

	if (!isValidDecimalForByteLength(decimalInput.value, numBytes, signedInteger)) {
		inputErrorState.error = true
		inputErrorState.errorFields.push(decimalInput)
		// maybe do a message next to the input box
	}
	else {
		Array.prototype.forEach.call(document.getElementsByClassName("input-field"), (element) => {
			element.style.removeProperty("color")
			element.style.removeProperty("background-color")
		})
		inputErrorState.error = false
		inputErrorState.errorFields = []
	}
}



/****************************************************************
 * These three functions ensure that the numbers entered are
 * valid for the number of bytes selected
 ****************************************************************/

function isValidDecimalForByteLength(inputValue, bytes, signed) {
	let binary = convert(inputValue.replace(/,/g, ""), 10, 2)

	if (binary.length > bytes * 8) {
		return false
	}
	else if (signed && binary.length === bytes * 8 && binary.charAt(0) === '1') {
		return false
	}

	return true
}

function isValidHexadecimalForByteLength(inputValue, bytes) {
	return inputValue.replace(/ /g, "").length <= bytes * 2
}

function isValidBinaryForByteLength(inputValue, bytes) {
	return inputValue.replace(/ /g, "").length <= bytes * 8
}