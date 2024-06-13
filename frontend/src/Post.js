import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({title, highlight, backdrop, content, createdAt, author, _id}) {
    return (
      <Link to={`/post/${_id}`} className="custom-link">
        <div className="post">
          <div className="image">
              <img src={`${process.env.REACT_APP_API_URL}/${backdrop}`} alt="" />
          </div>
          <div className="texts">
              <h2>{title}</h2>
              <p className="info">
                <span className="author">{author.username}</span>
                <time>{format(new Date(createdAt), 'MMM d, yyyy | HH:mm')}</time>
              </p>
              <p className="highlight">{highlight}</p>
          </div>    
        </div>
      </Link>
    );
};