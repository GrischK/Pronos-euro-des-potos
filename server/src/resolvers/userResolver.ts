import {Query, Resolver} from "type-graphql";

@Resolver()
export default class userResolver{
    @Query(()=> Boolean)
    async users():Promise<boolean> {
        return true;
    }
}