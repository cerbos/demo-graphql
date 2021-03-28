import { InputType, Field } from "type-graphql";
import Post from '../entities/Post'

@InputType()
class PostInput implements Partial<Post> {
  @Field()
  title: string;

  @Field()
  body: string;
}

export default PostInput;
