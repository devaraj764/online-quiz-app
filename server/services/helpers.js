async function findOrCreate(condition, newData, Model) {
    const existingDocument = await Model.findOne(condition);

    if (existingDocument) {
        // Document already exists, return it
        return { data: existingDocument, isNew: false };
    } else {
        // Document doesn't exist, create a new one with the provided data
        const newDocument = new Model(newData);
        await newDocument.save();
        return { data: newDocument, isNew: true };
    }
}

module.exports = { findOrCreate }