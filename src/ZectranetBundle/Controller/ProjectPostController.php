<?php
namespace ZectranetBundle\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use ZectranetBundle\Entity\ProjectPost;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use ZectranetBundle\Entity\User;

class ProjectPostController extends Controller
{
    /**
     * @param Request $request
     * @param int $project_id
     * @return Response
     */
    public function addPostAction(Request $request,$project_id)
    {
        $post = json_decode($request->getContent(), true);
        $post = (object)$post;
        /** @var EntityManager $em */
        $em = $this->getDoctrine()->getManager();
        /** @var User $user */
        $user = $this->getUser();
        $new_post = ProjectPost::addNewPost($em, $user->getId(), $project_id, $post->message);

        $response = new Response(json_encode(array('newPost' => $new_post->getInArray())));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function getPostsAction(Request $request, $project_id) {
        /** @var EntityManager $em */
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent(), true);
        $data = (object) $data;
        $phpPosts = ProjectPost::getPostsOffset($em,$project_id, $data->offset, $data->count);
        $jsonPosts = array();
        /** @var ProjectPost $post */
        foreach ($phpPosts as $post) {
            $jsonPosts[] = $post->getInArray();
        }
        $response = new Response(json_encode(array('Posts' => $jsonPosts)));
        $response->headers->set('Content-Type', 'application/json');
        return $response;

    }
}