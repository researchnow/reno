// Quick helper to title case our strings (aka thanks stack overflow)

export default str => str.replace(/\b\w+\b/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
