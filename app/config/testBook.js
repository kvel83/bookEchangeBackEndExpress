const testBook = {
    bookName: 'Ready player one',
    bookAuthor: 'Ernest Cline',
    bookEditorial: 'Nova',
    bookPages: 480,
    bookClasification: 'Ciencia Ficción',
    bookISBN: '9781947783270',
    bookDescription: 'Estamos en el año 2044 y, como el resto de la humanidad, Wade Watts prefiere mil veces el videojuego de OASIS al cada vez más sombrío mundo real.Se asegura que esconde las diabólicas piezas de un rompecabezas cuya resolución conduce a una fortuna incalculable. Las claves del enigma están basadas en la cultura de finales del siglo XX y, durante años, millones de humanos han intentado dar con ellas, sin éxito.De repente, Wade logra resolver el primer rompecabezas del premio, y, a partir de ese momento, debe competir contra miles de jugadores para conseguir el trofeo.La única forma de sobrevivir es ganar; pero para hacerlo tendrá que abandonar su existencia virtual y enfrentarse a la vida y al amor en el mundo real, del que siempre ha intentado escapar.',
};

const testWrongBook = {
    _id: 123,
    bookName: 'Ready player one',
    bookAuthor: 'Ernest Cline',
    bookEditorial: 'Nova',
    bookPages: 480,
    bookClasification: 'Ciencia Ficción',
    bookISBN: '9781947783270',
    bookDescription: 'Estamos en el año 2044 y, como el resto de la humanidad, Wade Watts prefiere',
    };


module.exports = {
    testBook,
    testWrongBook
}







