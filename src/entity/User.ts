import {Entity, Column, PrimaryColumn, OneToMany, JoinTable, AfterLoad} from "typeorm";
import Logger from "../services/Logger";
import { Group } from "./Group";
import { Token } from "./Token";

var axios = require('axios');

@Entity()
export class User {
    @PrimaryColumn("uuid")
    id!: String;

    @Column("varchar", { length: 10, nullable: false, unique: true})
    login!: String;

    @Column({default: true})
    enableConsultation: Boolean = true;

    @Column({default: true})
    enableViewing: Boolean = true;

    @OneToMany(() => Group, groups => groups.owner)
    @JoinTable()
    groups!: Group[];

    @AfterLoad()
    private getUserWithPortailData = async (retry: number = 0) => {
        if (retry >= Token.__MAX_RETRIES_) {
            Logger.error('Max retries exceeded while fetching the portail');
            return null;
        } else {
            if (!Token.isValid()) {
                Token.refreshToken(); 
            }

            const responseAxios = await axios({
                method: 'GET',
                url: `${process.env.AUTH_PORTAIL_URL}/api/v1/users/${this.id}`,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8',
                    'Authorization': 'Bearer ' + Token.getAccessToken()
                }
            }).catch((err: any) => {
                return err.response;
            }).then((response: any) => {
                return response;
            });
    
            if (responseAxios.status === 200) {
                this.deserializeFromPortailData(responseAxios.data);
                return
            } else if (responseAxios.status === 401) {
                Logger.info('Unauthorized while fetching the portail: ' + responseAxios.data.message 
                    + ' -> ' + responseAxios.data.exception);
                Token.refreshToken();
                await this.getUserWithPortailData(retry++);
                return;
            } else {
                Logger.error(responseAxios.data.message + ' -> ' + responseAxios.data.exception);
                return;
            }
        }
    }

    /**
     * These properties come from the portail
     */

    firstName!: String;

    lastName!: String;

    email!: String;

    image!: String;

    name!: String;

    isActive!: Boolean;

    public deserializeFromPortailData = (data: any) => {
        this.email = data.email;
        this.firstName = data.firstname;
        this.lastName = data.lastname;
        this.image = data.image;
        this.name = data.name;
        this.isActive = data.is_active;
    }
}
