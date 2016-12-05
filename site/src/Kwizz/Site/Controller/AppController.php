<?php
/**
 * Created by PhpStorm.
 * User: ldavid
 * Date: 11/30/16
 * Time: 1:13 PM
 */

namespace Kwizz\Site\Controller;


use Kwizz\Utils\Controller;
use Symfony\Component\HttpFoundation as Http;


class AppController extends Controller
{
    private static $QUESTIONS = [
        'question1' => [
            'question' => 'Are you a boy or a girl?',
            'values' => [
                ['label' => 'Boy', 'value' => 22],
                ['label' => 'Girl', 'value' => 6],
                ['label' => 'Yes', 'value' => 2]
            ],
            'total' => 30
        ],
        'question2' => [
            'question' => '',
        ]
    ];

    public function index() {
        if ($this->get('session')->get('user') === null) {
            return new Http\RedirectResponse('/app/login');
        }

        return $this->render('app/index.twig');
    }

    public function login(Http\Request $request) {
        if ($request->getMethod() === "POST" && $request->request->has('username')) {
            $this->get('session')->set('user', $request->request->get('username'));
            return new Http\RedirectResponse('/app');
        } else {
            return $this->render('app/login.twig');
        }
    }

    public function logout(Http\Request $request) {
        $this->get('session')->set('user', null);
        return new Http\RedirectResponse('/app');
    }

    public function student(Http\Request $request) {
        if ($this->get('session')->get('user') === null) {
            return new Http\RedirectResponse('/app/login');
        }

        return $this->render('app/student.twig', [
            'view' => $request->query->get('view', 'question1'),
            'data1' => self::$QUESTIONS['question1']
        ]);
    }

    public function prof(Http\Request $request) {
        if ($this->get('session')->get('user') === null) {
            return new Http\RedirectResponse('/app/login');
        }

        return $this->render('app/prof.twig', [
            'view' => $request->query->get('view', 'create'),
            'data1' => self::$QUESTIONS['question1']
        ]);
    }

}