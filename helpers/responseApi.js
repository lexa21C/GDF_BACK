class ResponseApi{
    structure = {
        status : "success",
        message : '',
        code : '200',
        results : null
    }

    constructor() {}

    setStatus = (code, status, message) => {
        this.structure.code = code;
        this.structure.status = status;
        this.structure.message = message;
    }

    setResult = (ressult,message) => {
        this.structure.results = ressult
        this.structure.message = message;

    }

    toResponse = () => {
        return {
            status : this.structure.status,
            message : this.structure.message,
            code : this.structure.code,
            results : this.structure.results
        }
    }
}

module.exports = ResponseApi 

