import React, { useEffect, useState } from 'react'
import {Row, Col, Button, Card} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import {getFirestore, collection, query, orderBy, onSnapshot} from 'firebase/firestore'
import { Link } from 'react-router-dom'

const PostsPage = ({history}) => {

    const db = getFirestore(app);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const onClickWrite = () => {
       if(sessionStorage.getItem('email')){
            history.push('/posts/write');
       }else{
            sessionStorage.setItem('target', '/posts/write');
            history.push('/login');
       }
       
        
    }

    const getPosts = () => {
        setLoading(true);
        const q = query(collection(db,'posts'), orderBy('date', 'desc'))
        onSnapshot(q, snapshot=>{
            let rows=[];
            snapshot.forEach(row=>{
                rows.push({id:row.id, ...row.data()});
            });
            setPosts(rows);
            setLoading(false);
        })        
    }
    
    useEffect(()=>{
        getPosts();
    },[]);

    if(loading) return <h1 className ='text-center my-5'>로딩중....</h1>

    return (
        <Row className = 'my-5'>
            <Col>
                <h1 className = 'text-center mb-5'>게시글</h1>
                <div className = 'text-end'>

                    <Button onClick={onClickWrite}>글쓰기</Button>
                </div>
                {posts.map(post =>
                    <Card key ={post.id} className = 'my-3'>
                        <Card.Header>
                            <Link to={`/posts/${post.id}`}>
                                <h5>{post.title}</h5>
                            </Link>
                        </Card.Header>
                        <Card.Body>
                            {post.body}
                        </Card.Body>
                        <Card.Footer>
                            Posted on {post.date} by {post.email}
                        </Card.Footer>
                    </Card>   
                )}
            </Col>
        </Row>
    )
}

export default PostsPage