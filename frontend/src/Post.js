import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({title, highlight, backdrop, content, createdAt, author, _id}) {
    return (
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={`${process.env.REACT_APP_API_URL}/${backdrop}`} alt="" />
          </Link>
        </div>
        <div className="texts">
            <Link to={`/post/${_id}`}><h2>{title}</h2></Link>
            <p className="info">
              <a href="#" className="author">{author.username}</a>
              <time>{format(new Date(createdAt), 'MMM d, yyyy | HH:mm')}</time>
            </p>
            <p className="highlight">{highlight}</p>
        </div>    
      </div>
    );
};