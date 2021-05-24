export class UserCriteria {
    firstName?: String | null = null;
    lastName?: String| null = null;
    semester?: String | null = null;
    enableConsultation?: Boolean | null = null;
    enableViewing?: Boolean | null = null;

    deserialize(object: any) {
        const { firstName, lastName, semester, enableConsultation, enableViewing } = object;

        if (firstName !== null && firstName !== undefined) {
            this.firstName = firstName;
        }

        if (lastName !== null && lastName !== undefined) {
            this.lastName = lastName;
        }

        if (semester !== null && semester !== undefined) {
            this.semester = semester;
        }

        if (enableConsultation !== null && enableConsultation !== undefined) {
            this.enableConsultation = enableConsultation;
        }

        if (enableViewing !== null && enableViewing !== undefined) {
            this.enableViewing = enableViewing;
        }

        return this;
    }
}