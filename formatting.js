

function formatFieldsForError(errorField) {

	let fields = document.getElementsByClassName("input-field")

	for (let i = 0; i < fields.length; i++) {
		if (fields[i] === errorField) {
			fields[i].style.backgroundColor = "var(--alert)"
		}
		else {
			fields[i].style.color = "var(--grayText)"
		}
	}
}

function removeErrorFormatting() {

	let fields = document.getElementsByClassName("input-field")

	for (let i = 0; i < fields.length; i++) {
		fields[i].style.removeProperty('background-color')
		fields[i].style.removeProperty('color')
	}
}

function unformatAllFields() {
	decimalInput.value = decimalInput.value.replace(/,/g, "")
	hexadecimalInput.value = hexadecimalInput.value.replace(/ /g, "")
	binaryInput.value = binaryInput.value.replace(/ /g, "")
}

function unformatDecimalValue(formattedValue) {
	return formattedValue.replace(/,/g, '')
}

function formatRawDecimalValue(rawValue) {
	if (rawValue.charAt(0) === '-') {
		if (rawValue.charAt(1) === '0') {
			rawValue = rawValue.replace('0', '')
		}
		return '-' + formatRawValue(rawValue.substring(1), 10)
	}
	else {
		if (rawValue.length > 1 && rawValue.charAt(0) === '0') {
			rawValue = rawValue.replace('0', '')
		}
		return formatRawValue(rawValue, 10)
	}
}

function formatRawValue(rawValue, base) {
	switch (base) {
		case 2:
			return addCharacters(padBitString(rawValue, numBytes), 8, " ");

		case 10:
			return addCharacters(rawValue, 3, ",");

		case 16:
			return addCharacters(padHexString(rawValue, numBytes), 2, " ");

		default:
			throw "invalid base in formatRawValue function"
	}
}

function addCharacters(string, blockSize, character) {
	let newString = ""
	let i = string.length
	do {
		newString = ((i - blockSize) > 0 ? character : "") + string.substring(max0(i - blockSize), i) + newString

		i -= blockSize
	} while (i > 0)

	return newString
}

function updateCaretPos(element, pos, prevValues) {
	if (element.value.charAt(pos) === ' ')
		pos++

	element.setSelectionRange(pos, pos)
}

function resetCaretPosition(element, pos, ignoreChars) {

	pos = findPos(element.value, pos, ignoreChars)

	// Modern browsers
	if (element.setSelectionRange) {
		element.focus()
		element.setSelectionRange(pos, pos)
	}
	else if (element.createTextRange) { // IE8 and below
    	let range = elemnt.createTextRange()
		range.collapse(true)
		range.moveEnd('character', pos)
		range.moveStart('character', pos)
		range.select()
	}
}

function setValue(element, prevValues, pos) {
	if (element.value.length < prevValues.formatted.length) {
		if (prevValues.formatted.charAt(pos) == ' ') {
			element.value = formatRawValue(element.value.replace(/ /g, ""), 2)
		}
		else {
			element.value = element.value.substring(0, pos) + '0' + prevValues.formatted.substring(pos + 1)
		}
	}
	else {
		element.value = element.value.substring(0, pos) + prevValues.formatted.substring(pos)
	}
}

function findPos(string, pos, ignoreChars) {
	let j = 0

	for (let i = 0; i < string.length; i++) {
		if (!ignoreChars.includes(string.charAt(i))) {
			j++
		}
		
		if (j === pos) {
			return i + 1
		}
	}

	return string.length
}