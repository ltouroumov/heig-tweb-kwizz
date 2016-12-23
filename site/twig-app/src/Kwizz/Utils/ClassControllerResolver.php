<?php
/**
 * Created by PhpStorm.
 * User: ldavid
 * Date: 9/23/16
 * Time: 6:05 PM
 */

namespace Kwizz\Utils;

use Silex\CallbackResolver;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Controller\ControllerResolverInterface;

class ClassControllerResolver implements ControllerResolverInterface
{
    private $delegate;
    private $callbackResolver;
    private $controllers;
    private $app;
    private $prefix;

    const CLASS_PATTERN = '/(\w+(\\\w+)*)::\w+/';

    /**
     * Constructor.
     *
     * @param object $app Application container
     * @param ControllerResolverInterface $delegate A ControllerResolverInterface instance to delegate to
     * @param CallbackResolver            $callbackResolver   A service resolver instance
     */
    public function __construct($app, $prefix, ControllerResolverInterface $delegate, CallbackResolver $callbackResolver)
    {
        $this->app = $app;
        $this->prefix = $prefix;
        $this->delegate = $delegate;
        $this->callbackResolver = $callbackResolver;
        $this->controllers = [];
    }

    /**
     * {@inheritdoc}
     */
    public function getController(Request $request)
    {
        $controller = $request->attributes->get('_controller', null);

        if (is_string($controller) && preg_match(self::CLASS_PATTERN, $controller)) {
            return $this->resolve($controller);
        } else {
            return $this->delegate->getController($request);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getArguments(Request $request, $controller)
    {
        return $this->delegate->getArguments($request, $controller);
    }

    /**
     * @param $controller string Controller definition
     *
     * @return callable Controller Callback
     */
    private function resolve($controller)
    {
        $callback = null;

        list($controllerName, $methodName) = explode('::', $controller, 2);
        $className = "{$this->prefix}\\$controllerName";

        if (!class_exists($className)) {
            throw new \InvalidArgumentException(sprintf("Controller class %s could not be found"));
        }


        if (!array_key_exists($controllerName, $this->controllers)) {
            $class = new \ReflectionClass($className);
            $instance = $class->newInstance();
            if ($instance instanceof Controller) {
                $instance->setApp($this->app);
            }
            $this->controllers[$controllerName] = $instance;
        }

        return [$this->controllers[$controllerName], $methodName];
    }
}