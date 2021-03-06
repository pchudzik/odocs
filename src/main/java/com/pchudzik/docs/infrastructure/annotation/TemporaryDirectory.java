package com.pchudzik.docs.infrastructure.annotation;

import org.springframework.beans.factory.annotation.Qualifier;

import java.lang.annotation.*;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Created by pawel on 14.03.15.
 */
@Inherited
@Qualifier("docsTmpDir")
@Retention(RUNTIME)
@Target(value={FIELD, METHOD, PARAMETER, TYPE, ANNOTATION_TYPE})
public @interface TemporaryDirectory {
	final String tmpDir = "docsTmpDir";
}
